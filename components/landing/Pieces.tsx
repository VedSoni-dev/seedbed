"use client";
// The landing page's pictures: the live garden in the hero, the app-frame of styles, the four feature fragments
// and the install window. The gardens are the real engine (lib/seedbed.js); the fragments are still drawings of
// the app's own controls, in seedbed's words.
import { useEffect, useRef, useState } from "react";
import { Garden } from "@/components/Garden";
import { SceneBg, SkyIcon, Swatch, inkFor } from "@/components/Scene";
import { PRESETS, type PresetKey, type Style } from "@/lib/seedbed.js";

const KEYS: PresetKey[] = ["meadow", "tulip", "lavender", "ink", "night"];

function useTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => { setTouch(matchMedia("(hover: none)").matches); }, []);
  return touch;
}

// ---------------------------------------------------------------- hero: the garden in its window

export function HeroWindow() {
  const [preset, setPreset] = useState<PresetKey>("meadow");
  const [touched, setTouched] = useState(false);
  const touch = useTouch();
  const style = PRESETS[preset];
  const night = preset === "night";
  return (
    <div className="ly-piece sb-hw">
      <div className="sb-hw__bar">
        <div className="sb-seg" role="group" aria-label="Garden style">
          {KEYS.map((k) => (
            <button key={k} type="button" aria-pressed={preset === k} aria-label={PRESETS[k].label} onClick={() => setPreset(k)}>
              <Swatch style={PRESETS[k]} /><span>{PRESETS[k].label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="paper sb-hw__paper" style={{ ["--paper" as string]: style.card, ["--paper-ink" as string]: inkFor(style.card) }}>
        <div className="bed sb-hw__bed" onPointerMove={() => setTouched(true)} onPointerDown={() => setTouched(true)}>
          <Garden options={{ preset: night ? "meadow" : preset, night, ghost: true, radius: 140 }} />
          <span className="hint" style={{ opacity: touched ? 0 : 1 }}>{touch ? "drag a finger across the dots" : "move your cursor across the dots"}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- #styles: the app-frame

const GROWN: Style[] = [
  { label: "Autumn maple", card: "#f6eadb", dot: "#c8b39b", stem: "#6b4a2b", leaf: "#a5622f", petals: ["#c2410c", "#d97706", "#b45309", "#ea580c"], center: "#7c2d12", heads: ["daisy", "cosmos"], line: false, glow: 0 },
  { label: "Cherry blossom", card: "#fbf3f3", dot: "#d6c3c3", stem: "#6b4f4f", leaf: "#8aa37b", petals: ["#f6c6d4", "#f3b0c3", "#fde2ea", "#eaa1b6"], center: "#e0a33a", heads: ["cosmos"], line: false, glow: 0 },
  { label: "Sage bakery", card: "#eef0e6", dot: "#b5bba6", stem: "#4f6b4a", leaf: "#7d9a6c", petals: ["#f2e6c9", "#e9d29a", "#ffffff", "#d9c38c"], center: "#c08a3e", heads: ["daisy"], line: false, glow: 0 },
  { label: "Neon arcade", card: "#121726", dot: "#36405e", stem: "#38bdf8", leaf: "#22d3ee", petals: ["#f472b6", "#facc15", "#34d399", "#60a5fa"], center: "#ffffff", heads: ["cosmos", "spike"], line: false, glow: 10 },
];
const ROWS: { key: string; style: Style; sub: string; kind: "Preset" | "Grown" }[] = [
  ...KEYS.map((k) => ({ key: k, style: PRESETS[k], kind: "Preset" as const, sub: k === "night" ? "Moonlit card, glowing petals" : k === "ink" ? "Line drawing on white paper" : k === "tulip" ? "Tulips on warm paper" : k === "lavender" ? "Spikes on pale lilac paper" : "Cosmos and daisies on cream" })),
  ...GROWN.map((s, i) => ({ key: `g${i}`, style: s, kind: "Grown" as const, sub: ["“rust and gold, autumn”", "“soft and pale, spring”", "“a bakery with sage walls”", "“neon arcade at midnight”"][i] })),
];

export function StylesFrame() {
  const [open, setOpen] = useState(3);
  const [radius, setRadius] = useState(150);
  const [height, setHeight] = useState(1.6);
  const [wilt, setWilt] = useState(500);
  const row = ROWS[open];
  const custom = row.kind === "Grown" ? row.style : null;
  const preset = (row.kind === "Preset" ? row.key : "meadow") as PresetKey;
  const night = row.key === "night";
  const style = row.style;
  return (
    <div className="ui app sb-app fill" role="group" aria-label="The seedbed app: your styles beside the open garden and its sliders">
      <div className="app__pane app__pane--list sb-list">
        <div className="sb-list__bar"><span>Styles</span><em>{ROWS.length}</em></div>
        <ul>
          {ROWS.map((r, i) => (
            <li key={r.key}>
              <button type="button" aria-pressed={open === i} onClick={() => setOpen(i)}>
                <Swatch style={r.style} />
                <span className="sb-list__txt"><b>{r.style.label}</b><small>{r.sub}</small></span>
                <span className={`sb-list__st${r.kind === "Grown" ? " is-grown" : ""}`}>{r.kind}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="app__pane app__pane--open sb-open">
        <div className="sb-open__head">
          <span className="sb-open__name">{style.label}</span>
          <span className="sb-open__meta">{style.heads.filter((h, i, a) => a.indexOf(h) === i).join(" · ")}</span>
        </div>
        <div className="scene sb-open__scene">
          <SceneBg night={night || inkFor(style.card) !== "#23211d"} />
          <div className="paper" style={{ ["--paper" as string]: style.card, ["--paper-ink" as string]: inkFor(style.card) }}>
            <div className="bed sb-open__bed">
              <Garden options={{ preset: night ? "meadow" : preset, night, custom, radius, height, wiltDelay: wilt, ghost: true, pitch: 34 }} />
            </div>
          </div>
        </div>
        <div className="sb-sliders">
          <Slider label="Bloom radius" value={radius} min={60} max={260} step={5} fmt={(v) => `${v}px`} onChange={setRadius} />
          <Slider label="Stem height" value={height} min={0.6} max={3} step={0.1} fmt={(v) => `${v.toFixed(1)}×`} onChange={setHeight} />
          <Slider label="Wilt delay" value={wilt} min={0} max={2000} step={50} fmt={(v) => `${(v / 1000).toFixed(2)} s`} onChange={setWilt} />
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, fmt, onChange }: { label: string; value: number; min: number; max: number; step: number; fmt: (v: number) => string; onChange: (v: number) => void }) {
  const id = `sb-${label.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <div className="sb-slider">
      <span><label htmlFor={id}>{label}</label><output htmlFor={id}>{fmt(value)}</output></span>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

// ---------------------------------------------------------------- #features: four still fragments

/** One cosmos head, drawn like the engine draws it (petals round a centre). */
function Head({ x, y, r, color, center = "#f0bf37", n = 8 }: { x: number; y: number; r: number; color: string; center?: string; n?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: n }, (_, i) => <ellipse key={i} cx="0" cy={-r * 0.55} rx={r * 0.32} ry={r * 0.55} fill={color} transform={`rotate(${(360 / n) * i})`} />)}
      <circle r={r * 0.3} fill={center} />
    </g>
  );
}
function Plant({ x, base, h, color, leaves = true, head = 1 }: { x: number; base: number; h: number; color: string; leaves?: boolean; head?: number }) {
  return (
    <g>
      <path d={`M${x} ${base} C ${x} ${base - h * 0.5}, ${x + 3} ${base - h * 0.8}, ${x + 2} ${base - h}`} stroke="#3e6a3c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {leaves && <path d={`M${x + 1} ${base - h * 0.42} c 10 -2 15 -8 16 -15 c -9 1 -14 7 -16 15 z`} fill="#68904d" />}
      {leaves && <path d={`M${x} ${base - h * 0.28} c -9 -1 -14 -7 -15 -13 c 8 1 13 6 15 13 z`} fill="#68904d" />}
      {head > 0 && <Head x={x + 2} y={base - h} r={13 * head} color={color} n={head < 0.6 ? 5 : 8} />}
    </g>
  );
}

export function StagesFragment() {
  const base = 150;
  return (
    <div className="ui sf sf--paper" role="img" aria-label="One dot growing: a dot, a stem, leaves, a bud, then the open flower">
      <svg viewBox="0 0 360 180" className="sf__svg" aria-hidden="true">
        <circle cx="40" cy={base} r="2.6" fill="#bdb4a3" />
        <circle cx="110" cy={base} r="2.6" fill="#bdb4a3" />
        <path d={`M110 ${base} C 110 ${base - 25}, 112 ${base - 38}, 111 ${base - 48}`} stroke="#3e6a3c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="180" cy={base} r="2.6" fill="#bdb4a3" />
        <Plant x={180} base={base} h={78} color="#ea7aa7" head={0} />
        <circle cx="250" cy={base} r="2.6" fill="#bdb4a3" />
        <Plant x={250} base={base} h={96} color="#ea7aa7" head={0.45} />
        <circle cx="320" cy={base} r="2.6" fill="#bdb4a3" />
        <Plant x={320} base={base} h={104} color="#ea7aa7" head={1} />
      </svg>
    </div>
  );
}

export function PhoneFragment() {
  const dots: [number, number][] = [];
  for (let y = 0; y < 7; y++) for (let x = 0; x < 5; x++) dots.push([28 + x * 31, 70 + y * 31]);
  const trail: [number, number, number, string][] = [[59, 225, 0.55, "#a57dd8"], [90, 194, 0.8, "#ea7aa7"], [121, 163, 1, "#e3b23c"], [121, 194, 0.7, "#f6ecd4"]];
  return (
    <div className="ui sf sf--phone" role="img" aria-label="A phone with the dot grid: flowers grow along the path of a finger">
      <svg viewBox="0 0 184 300" className="sf__svg" aria-hidden="true">
        <rect x="2" y="2" width="180" height="340" rx="28" fill="#f7f1e3" stroke="currentColor" strokeOpacity=".22" strokeWidth="2" />
        <rect x="66" y="14" width="52" height="14" rx="7" fill="currentColor" opacity=".18" />
        {dots.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill="#bdb4a3" />)}
        {trail.map(([x, y, s, c]) => <Plant key={`${x}-${y}`} x={x} base={y} h={44 * s} color={c} head={s} />)}
        <circle cx="150" cy="132" r="17" fill="currentColor" opacity=".12" />
        <circle cx="150" cy="132" r="7" fill="currentColor" opacity=".35" />
      </svg>
    </div>
  );
}

export function GrowFragment() {
  const s = GROWN[0];
  return (
    <div className="ui sf sf--card" role="img" aria-label="The grow-a-style field: the sentence rust and gold, autumn becomes the Autumn maple style">
      <div className="sf__h"><b>Grow a style from words</b><small>publik-fast</small></div>
      <div className="sf__field"><span>rust and gold, autumn</span><span className="sf__btn">Grow</span></div>
      <div className="sf__out">
        <Swatch style={s} />
        <span className="sf__name">{s.label}</span>
        <span className="sf__colors">{[s.card, s.stem, ...s.petals].map((c) => <i key={c} style={{ background: c }} />)}</span>
      </div>
    </div>
  );
}

export function ExportFragment() {
  return (
    <div className="ui sf sf--card" role="img" aria-label="The copy panel: web component, React and CDN tag tabs, the tag with the settings, and Copy code">
      <div className="sf__tabs"><span className="is-on">Web component</span><span>React</span><span>CDN tag</span></div>
      <pre className="sf__code">{`<seedbed-garden preset="tulip"
  radius="150" wilt-delay="500"
  style="height:320px">
</seedbed-garden>`}</pre>
      <span className="sf__btn sf__btn--wide">Copy code</span>
    </div>
  );
}

// ---------------------------------------------------------------- #install: the tag, running

export function InstallWindow() {
  // the <seedbed-garden> element lib/seedbed.js defines (the same code as /seedbed.js), made after hydration:
  // the element draws its canvas as soon as it is defined, so it never goes into the server's HTML
  const live = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = document.createElement("seedbed-garden");
    el.setAttribute("preset", "meadow");
    el.setAttribute("radius", "140");
    el.style.cssText = "display:block;position:absolute;inset:0";
    live.current?.append(el);
    return () => el.remove();
  }, []);
  return (
    <div className="ui sb-iw">
      <div className="sb-iw__bar"><span className="sb-iw__dots" aria-hidden="true"><i /><i /><i /></span><span>index.html</span></div>
      <pre className="sb-iw__code"><code>
        <span className="t">&lt;script</span> <span className="a">type</span>=<span className="s">&quot;module&quot;</span> <span className="a">src</span>=<span className="s">&quot;./seedbed.js&quot;</span><span className="t">&gt;&lt;/script&gt;</span>{"\n\n"}
        <span className="t">&lt;seedbed-garden</span> <span className="a">preset</span>=<span className="s">&quot;meadow&quot;</span> <span className="a">radius</span>=<span className="s">&quot;140&quot;</span>{"\n"}
        {"  "}<span className="a">style</span>=<span className="s">&quot;display:block;height:260px&quot;</span><span className="t">&gt;&lt;/seedbed-garden&gt;</span>
      </code></pre>
      <div className="sb-iw__live" ref={live} />
    </div>
  );
}

/** A still meadow on the paper card: the picture beside the questions until the launch film exists. */
export function MeadowStill() {
  const base = 150;
  const row: [number, number, string, number][] = [[40, 70, "#a57dd8", 0.8], [96, 96, "#ea7aa7", 1], [150, 60, "#e3b23c", 0.7], [206, 104, "#f6ecd4", 1.05], [262, 82, "#d8628c", 0.9], [318, 58, "#b993e6", 0.65]];
  return (
    <div className="ui sf sf--paper sf--meadow" role="img" aria-label="A row of cosmos and daisies grown out of the dot grid">
      <svg viewBox="0 0 360 180" className="sf__svg" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={12 + i * 37.3} cy={base + 14} r="2.4" fill="#bdb4a3" />)}
        {row.map(([x, h, c, k]) => <g key={x}><circle cx={x} cy={base} r="2.4" fill="#bdb4a3" /><Plant x={x} base={base} h={h} color={c} head={k} /></g>)}
      </svg>
    </div>
  );
}
