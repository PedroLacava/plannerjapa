import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Japan Trip Planner" },
      { name: "description", content: "Planejador interativo (drag-and-drop) da viagem ao Japão, Nov 2026." },
      { property: "og:title", content: "Japan Trip Planner" },
      { property: "og:description", content: "Planejador interativo (drag-and-drop) da viagem ao Japão, Nov 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="fixed inset-0 w-full h-full">
      <iframe
        src="/planner.html"
        title="Japan Trip Planner"
        className="w-full h-full border-0"
        allowFullScreen
      />
    </div>
  );
}
