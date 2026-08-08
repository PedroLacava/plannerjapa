import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Japan Trip Planner" },
      {
        name: "description",
        content: "Planejador interativo (drag-and-drop) da viagem ao Japão, Nov 2026.",
      },
      { property: "og:title", content: "Japan Trip Planner" },
      {
        property: "og:description",
        content: "Planejador interativo (drag-and-drop) da viagem ao Japão, Nov 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const installPromptRef = useRef<
    (Event & { prompt: () => Promise<void>; userChoice: Promise<unknown> }) | null
  >(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js");
    const onInstall = (event: Event) => {
      event.preventDefault();
      installPromptRef.current = event as Event & {
        prompt: () => Promise<void>;
        userChoice: Promise<unknown>;
      };
      frameRef.current?.contentWindow?.postMessage(
        { type: "PLANNER_INSTALL_AVAILABLE" },
        location.origin,
      );
    };
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.data?.type !== "PLANNER_INSTALL_REQUEST")
        return;
      const prompt = installPromptRef.current;
      if (!prompt) return;
      void prompt
        .prompt()
        .then(() => prompt.userChoice)
        .finally(() => {
          installPromptRef.current = null;
        });
    };
    window.addEventListener("beforeinstallprompt", onInstall);
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("beforeinstallprompt", onInstall);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full">
      <iframe
        ref={frameRef}
        src="/planner.html"
        title="Japan Trip Planner"
        className="w-full h-full border-0"
        allowFullScreen
      />
    </div>
  );
}
