import { createFileRoute } from "@tanstack/react-router";

const ROW_ID = "global";

async function getAdmin() {
  const mod = await import("@/integrations/supabase/client.server");
  return mod.supabaseAdmin;
}

export const Route = createFileRoute("/api/public/state")({
  server: {
    handlers: {
      GET: async () => {
        const supabaseAdmin = await getAdmin();
        const { data, error } = await supabaseAdmin
          .from("planner_state")
          .select("state, revision")
          .eq("id", ROW_ID)
          .maybeSingle();
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(
          JSON.stringify({
            state: data?.state ?? {},
            revision: data?.revision ?? 0,
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
            },
          },
        );
      },
      PUT: async ({ request }) => {
        let payload: { state?: Record<string, string> };
        try {
          payload = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "invalid json" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const state = payload?.state ?? {};
        const supabaseAdmin = await getAdmin();
        const { data: current } = await supabaseAdmin
          .from("planner_state")
          .select("revision")
          .eq("id", ROW_ID)
          .maybeSingle();
        const nextRevision = (current?.revision ?? 0) + 1;
        const { error } = await supabaseAdmin
          .from("planner_state")
          .upsert({
            id: ROW_ID,
            state,
            revision: nextRevision,
            updated_at: new Date().toISOString(),
          });
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(
          JSON.stringify({ ok: true, revision: nextRevision }),
          { headers: { "Content-Type": "application/json" } },
        );
      },
    },
  },
});
