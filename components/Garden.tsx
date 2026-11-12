"use client";
import { useEffect, useRef } from "react";
import { createGarden, type Garden as G, type Options } from "@/lib/seedbed.js";

/** The live garden. Mounts the framework-free engine once; option changes are applied in place. */
export function Garden({ options, className, onReady }: { options: Partial<Options>; className?: string; onReady?: (g: G) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const g = useRef<G | null>(null);
  const opts = useRef(options);
  opts.current = options;
  useEffect(() => {
    if (!ref.current) return;
    g.current = createGarden(ref.current, opts.current);
    onReady?.(g.current);
    return () => { g.current?.destroy(); g.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const key = JSON.stringify(options);
  useEffect(() => { g.current?.set(opts.current); }, [key]);
  return <div ref={ref} className={className} style={{ position: "absolute", inset: 0 }} />;
}
