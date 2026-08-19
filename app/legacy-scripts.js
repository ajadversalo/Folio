"use client";

import { useEffect } from "react";

export default function LegacyScripts({ scripts }) {
  useEffect(() => {
    let cancelled = false;
    const added = [];

    async function start() {
      for (const src of scripts) {
        if (cancelled) return;
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
          added.push(script);
        });
      }
    }

    start().catch(error => console.error("Unable to start Folio", error));
    return () => {
      cancelled = true;
      added.forEach(script => script.remove());
    };
  }, [scripts]);

  return null;
}
