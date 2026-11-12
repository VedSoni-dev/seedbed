import { DEFAULTS, normalize, type Options } from "@/lib/seedbed.js";

export const SITE = "https://seedbed-gray.vercel.app";

const ATTR: [keyof Options, string][] = [
  ["preset", "preset"], ["pitch", "pitch"], ["radius", "radius"], ["height", "height"], ["speed", "speed"],
  ["wiltDelay", "wilt-delay"], ["density", "density"], ["seed", "seed"], ["maxBlooms", "max-blooms"],
];

/** Only what differs from the defaults, so the snippet stays short and reads like the settings you chose. */
function diff(o: Options) {
  return ATTR.filter(([k]) => o[k] !== DEFAULTS[k]).map(([k, a]) => [k, a, o[k]] as const);
}

export function htmlSnippet(input: Partial<Options>, height = 320) {
  const o = normalize(input);
  const attrs = diff(o).map(([, a, v]) => ` ${a}="${v}"`).join("");
  const night = o.night ? " night" : "";
  const custom = o.custom ? `\n  custom-style='${JSON.stringify(o.custom)}'` : "";
  return `<!-- seedbed: a hover garden. Save seedbed.js next to your page (${SITE}/seedbed.js), MIT. -->
<script type="module" src="./seedbed.js"></script>

<seedbed-garden${attrs}${night}${custom}
  style="display:block;height:${height}px;border-radius:16px;overflow:hidden"></seedbed-garden>`;
}

export function reactSnippet(input: Partial<Options>, height = 320) {
  const o = normalize(input);
  const props: string[] = diff(o).map(([k, , v]) => `${k}: ${typeof v === "string" ? JSON.stringify(v) : v}`);
  if (o.night) props.push("night: true");
  if (o.custom) props.push(`custom: ${JSON.stringify(o.custom)}`);
  return `// SeedbedGarden.tsx: put seedbed.js (${SITE}/seedbed.js) next to this file. MIT.
"use client";
import { useEffect, useRef } from "react";
import { createGarden } from "./seedbed.js";

const OPTIONS = { ${props.join(", ")} };

export default function SeedbedGarden({ height = ${height} }: { height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const garden = createGarden(ref.current, OPTIONS);
    return () => garden.destroy(); // safe under StrictMode's double mount
  }, []);
  return <div ref={ref} style={{ height, borderRadius: 16, overflow: "hidden" }} />;
}`;
}

export function cdnSnippet(input: Partial<Options>) {
  return htmlSnippet(input).replace(`src="./seedbed.js"`, `src="${SITE}/seedbed.js"`).replace(/^<!--.*-->\n/, "<!-- seedbed: a hover garden, MIT. -->\n");
}
