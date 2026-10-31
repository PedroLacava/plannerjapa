import { createFileRoute } from '@tanstack/react-router';
import catalog from '@/lib/calendar-catalog';
import { buildEvents, toIcs } from '@/lib/trip-calendar';

export const Route = createFileRoute('/api/public/calendar')({
  server: { handlers: { GET: async ({ request }) => {
    const url = new URL(request.url);
    try {
      // Same public, shared itinerary as /api/public/state; no writes or schema changes.
      const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
      const { data, error } = await supabaseAdmin.from('planner_state').select('state, revision').eq('id', 'global').maybeSingle();
      if (error || !data) throw Error('State unavailable');
      if (!data.state || typeof data.state !== 'object' || Array.isArray(data.state)) throw Error('Invalid itinerary');
      const events = buildEvents(data.state, catalog);
      if (url.searchParams.get('format') === 'json') return Response.json({ events, revision: data.revision }, { headers: { 'Cache-Control': 'no-store' } });
      return new Response(toIcs(events), { headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': (url.searchParams.has('download') ? 'attachment' : 'inline') + '; filename="japao-2026.ics"',
        'Cache-Control': 'no-cache, max-age=0',
      } });
    } catch {
      return new Response('Não foi possível carregar o roteiro. Tente novamente.', { status: 503, headers: { 'Cache-Control': 'no-store' } });
    }
  } } },
});
