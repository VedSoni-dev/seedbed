"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Garden } from "@/components/Garden";
import { SceneBg, SkyIcon, Swatch, inkFor } from "@/components/Scene";
import { PublikChoice, usePublik } from "@/components/PublikGate";
import { DEFAULTS, PRESETS, normalize, resolveStyle, type Garden as G, type Options, type PresetKey, type Style } from "@/lib/seedbed.js";
import { cdnSnippet, htmlSnippet, reactSnippet } from "@/lib/exportCode";
import { load, newId, save, type GardenDoc, type Store } from "@/lib/store";

const KEYS: PresetKey[] = ["meadow", "tulip", "lavender", "ink", "night"];

type Num = "radius" | "height" | "speed" | "wiltDelay" | "density" | "pitch" | "seed";
const SLIDERS: { k: Num; label: string; min: number; max: number; step: number; fmt: (v: number) => string }[] = [
  { k: "radius", label: "Bloom radius", min: 50, max: 300, step: 5, fmt: (v) => `${v}px` },
  { k: "height", label: "Stem height", min: 0.6, max: 3, step: 0.1, fmt: (v) => `${v.toFixed(1)}×` },
  { k: "speed", label: "Grow speed", min: 0.3, max: 3, step: 0.1, fmt: (v) => `${v.toFixed(1)}×` },
  { k: "wiltDelay", label: "Wilt delay", min: 0, max: 2500, step: 50, fmt: (v) => `${(v / 1000).toFixed(2)}s` },
  { k: "density", label: "Density", min: 1, max: 4, step: 1, fmt: (v) => (v === 1 ? "every dot" : `1 in ${v}`) },
  { k: "pitch", label: "Dot spacing", min: 24, max: 64, step: 1, fmt: (v) => `${v}px` },
  { k: "seed", label: "Seed", min: 1, max: 99, step: 1, fmt: (v) => `#${v}` },
];

const IDEAS = ["autumn maple, rust and gold", "neon arcade at midnight", "cherry blossom, soft and pale", "a bakery with sage green walls"];

export default function Playground() {
  const [store, setStore] = useState<Store | null>(null);
  useEffect(() => { setStore(load()); }, []);
  const update = useCallback((fn: (s: Store) => Store) => setStore((s) => { if (!s) return s; const n = fn(s); save(n); return n; }), []);

  if (!store) return <div className="app-loading" aria-busy="true">Loading your gardens…</div>;
  const current = store.gardens.find((g) => g.id === store.current) ?? store.gardens[0];
  if (!current) return <Onboarding onCreate={(g) => update((s) => ({ ...s, gardens: [...s.gardens, g], current: g.id }))} />;
  return <Workbench key={current.id} store={store} doc={current} update={update} />;
}

// ---------------------------------------------------------------- first run

function Onboarding({ onCreate, onCancel }: { onCreate: (g: GardenDoc) => void; onCancel?: () => void }) {
  const [name, setName] = useState("");
  const [preset, setPreset] = useState<PresetKey>("meadow");
  const create = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ id: newId(), name: name.trim() || "My site", options: { preset, night: false }, styles: [], created: Date.now() });
  };
  return (
    <div className="onboard">
      <form className="onboard-card" onSubmit={create}>
        <Link href="/" className="logo-sm"><img src="/icon.svg" alt="" width={22} height={22} />seedbed</Link>
        <h1>Start your garden</h1>
        <p className="muted">A garden is one hover-bloom setup for one site. You can tune it, grow new styles and copy its code. It is saved in this browser.</p>
        <label className="field">
          <span>Which site is it for?</span>
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="My portfolio" maxLength={40} />
        </label>
        <fieldset className="field">
          <legend>Start from a style</legend>
          <div className="chips">
            {KEYS.map((k) => (
              <button key={k} type="button" className="chip" aria-pressed={preset === k} onClick={() => setPreset(k)}>
                <Swatch style={PRESETS[k]} />{PRESETS[k].label}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="onboard-preview" style={{ background: PRESETS[preset].card }}>
          <Garden options={{ preset, pitch: 30, radius: 90, ghost: true }} />
        </div>
        <div className="row">
          <button className="btn btn-primary" type="submit">Plant it →</button>
          {onCancel && <button className="btn" type="button" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------- the workbench

function Workbench({ store, doc, update }: { store: Store; doc: GardenDoc; update: (fn: (s: Store) => Store) => void }) {
  const opts = useMemo(() => normalize(doc.options), [doc.options]);
  const style = resolveStyle(opts);
  const garden = useRef<G | null>(null);
  const [adding, setAdding] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [touched, setTouched] = useState(false);
  const [tab, setTab] = useState<"html" | "react" | "cdn">("html");
  const [copied, setCopied] = useState(false);
  const [height, setHeight] = useState(320);
  const styleRef = useRef<HTMLElement>(null);
  const codeRef = useRef<HTMLElement>(null);

  const patchDoc = (p: Partial<GardenDoc>) => update((s) => ({ ...s, gardens: s.gardens.map((g) => (g.id === doc.id ? { ...g, ...p } : g)) }));
  const setOpt = (p: Partial<Options>) => patchDoc({ options: { ...doc.options, ...p } });

  const code = tab === "html" ? htmlSnippet(doc.options, height) : tab === "react" ? reactSnippet(doc.options, height) : cdnSnippet(doc.options);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { setCopied(false); }
  };

  if (adding) return <Onboarding onCancel={() => setAdding(false)} onCreate={(g) => { setAdding(false); update((s) => ({ ...s, gardens: [...s.gardens, g], current: g.id })); }} />;

  const howto = !store.howtoDone;
  const activeKey = opts.custom ? null : opts.night ? "night" : opts.preset;

  return (
    <div className="bench">
      <header className="bench-top">
        <Link href="/" className="logo-sm"><img src="/icon.svg" alt="" width={22} height={22} />seedbed</Link>
        <div className="gardens">
          {renaming ? (
            <form onSubmit={(e) => { e.preventDefault(); setRenaming(false); }}>
              <input className="rename" autoFocus defaultValue={doc.name} maxLength={40} aria-label="Garden name"
                onBlur={(e) => { patchDoc({ name: e.target.value.trim() || doc.name }); setRenaming(false); }} />
            </form>
          ) : (
            <select aria-label="Your gardens" value={doc.id} onChange={(e) => {
              if (e.target.value === "__new") setAdding(true);
              else update((s) => ({ ...s, current: e.target.value }));
            }}>
              {store.gardens.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              <option value="__new">+ New garden</option>
            </select>
          )}
          <button className="btn btn-sm" type="button" onClick={() => setRenaming(true)}>Rename</button>
          {store.gardens.length > 1 && (
            <button className="btn btn-sm" type="button" onClick={() => {
              if (!confirm(`Delete “${doc.name}”? This only removes it from this browser.`)) return;
              update((s) => { const gardens = s.gardens.filter((g) => g.id !== doc.id); return { ...s, gardens, current: gardens[0]?.id ?? null }; });
            }}>Delete</button>
          )}
        </div>
      </header>

      <div className="bench-grid">
        <div className="bench-main">
          <div className="scene">
            <SceneBg night={opts.night || inkFor(style.card) !== "#23211d"} />
            <div className="paper" style={{ ["--paper" as string]: style.card, ["--paper-ink" as string]: inkFor(style.card) }}>
              <div className="paper-head">
                <div className="who"><span className="avatar">{doc.name.slice(0, 1).toUpperCase()}</span>{doc.name}</div>
                <button className="sky-toggle" type="button" aria-label={opts.night ? "Switch to day" : "Switch to night"} onClick={() => setOpt({ night: !opts.night })}>
                  <SkyIcon night={opts.night} />
                </button>
              </div>
              <div className="bed" onPointerMove={() => setTouched(true)} onPointerDown={() => setTouched(true)}>
                <Garden options={doc.options} onReady={(g) => { garden.current = g; }} />
                <span className="hint" style={{ opacity: touched ? 0 : 1 }}>move or drag across the dots</span>
              </div>
            </div>
          </div>

          {howto && (
            <ol className="howto" aria-label="How to use seedbed">
              <li><button type="button" onClick={() => garden.current?.sweep()}><b>1. Move across the dots.</b> Flowers grow under you and wilt when you leave. <u>Show me</u></button></li>
              <li><button type="button" onClick={() => styleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}><b>2. Pick a style</b> or describe one and let AI grow it. <u>Go to styles</u></button></li>
              <li><button type="button" onClick={() => codeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}><b>3. Copy the code</b> into your site, settings included. <u>Go to code</u></button></li>
              <li className="howto-x"><button type="button" onClick={() => update((s) => ({ ...s, howtoDone: true }))}>Got it, hide this</button></li>
            </ol>
          )}

          <section className="panel code" ref={codeRef} aria-labelledby="code-h">
            <div className="panel-head">
              <h2 id="code-h">Copy it into your site</h2>
              <div className="tabs" role="tablist">
                {(["html", "react", "cdn"] as const).map((t) => (
                  <button key={t} role="tab" aria-selected={tab === t} type="button" onClick={() => setTab(t)}>{t === "html" ? "Web component" : t === "react" ? "React" : "CDN tag"}</button>
                ))}
              </div>
            </div>
            <p className="muted small">
              {tab === "cdn" ? "One tag, loaded from this site. Quickest to try." : <>Save <a href="/seedbed.js" download>seedbed.js</a> (one file, no dependencies, MIT) next to your page, then paste this.</>}
              {" "}Height <input className="h-in" type="number" min={120} max={900} value={height} onChange={(e) => setHeight(Math.min(900, Math.max(120, Number(e.target.value) || 320)))} aria-label="Height in pixels" />px
            </p>
            <pre><code>{code}</code></pre>
            <div className="row">
              <button className="btn btn-primary" type="button" onClick={copy}>{copied ? "Copied ✓" : "Copy code"}</button>
              <a className="btn" href="/seedbed.js" download>Download seedbed.js</a>
            </div>
          </section>
        </div>

        <aside className="bench-side">
          <section className="panel" ref={styleRef} aria-labelledby="style-h">
            <h2 id="style-h">Style</h2>
            <div className="chips">
              {KEYS.map((k) => (
                <button key={k} type="button" className="chip" aria-pressed={activeKey === k}
                  onClick={() => setOpt(k === "night" ? { night: true, custom: null } : { preset: k, night: false, custom: null })}>
                  <Swatch style={PRESETS[k]} />{PRESETS[k].label}
                </button>
              ))}
              {doc.styles.map((s, i) => (
                <span key={i} className="chip-wrap">
                  <button type="button" className="chip" aria-pressed={!!opts.custom && !opts.night && JSON.stringify(opts.custom) === JSON.stringify(s)}
                    onClick={() => setOpt({ custom: s, night: false })}>
                    <Swatch style={s} />{s.label}
                  </button>
                  <button type="button" className="chip-del" aria-label={`Remove ${s.label}`}
                    onClick={() => patchDoc({ styles: doc.styles.filter((_, j) => j !== i), options: JSON.stringify(opts.custom) === JSON.stringify(s) ? { ...doc.options, custom: null } : doc.options })}>×</button>
                </span>
              ))}
            </div>
            <GrowStyle onStyle={(s) => patchDoc({ styles: [...doc.styles, s].slice(-12), options: { ...doc.options, custom: s, night: false } })} />
          </section>

          <section className="panel" aria-labelledby="tune-h">
            <div className="panel-head">
              <h2 id="tune-h">Tune</h2>
              <button className="btn btn-sm" type="button" onClick={() => setOpt(Object.fromEntries(SLIDERS.map((s) => [s.k, DEFAULTS[s.k]])))}>Reset</button>
            </div>
            <div className="sliders">
              {SLIDERS.map((s) => (
                <label key={s.k} className="slider">
                  <span><span>{s.label}</span><output>{s.fmt(opts[s.k])}</output></span>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={opts[s.k]} onChange={(e) => setOpt({ [s.k]: Number(e.target.value) })} />
                </label>
              ))}
            </div>
            <button className="btn btn-sm" type="button" onClick={() => garden.current?.sweep()}>Replay the sweep</button>
          </section>

          <p className="foot-line">free &amp; open source · not affiliated with Mohamed Siddique · <a href="https://github.com/VedSoni-dev/seedbed" target="_blank" rel="noopener noreferrer">GitHub</a></p>
        </aside>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- AI: grow a style from words

function GrowStyle({ onStyle }: { onStyle: (s: Style) => void }) {
  const { choice } = usePublik();
  const [about, setAbout] = useState("");
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<{ msg: string; topUp?: string } | null>(null);
  useEffect(() => { try { setKey(sessionStorage.getItem("seedbed:key") ?? ""); } catch { /* ignore */ } }, []);
  const ownKey = choice !== "publik";

  const grow = async (text = about) => {
    if (!text.trim()) { setErr({ msg: "Describe a mood first, like “autumn maple, rust and gold”." }); return; }
    setBusy(true); setErr(null);
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (ownKey && key.trim()) headers["x-anthropic-key"] = key.trim();
      const res = await fetch("/api/style", { method: "POST", headers, body: JSON.stringify({ about: text }) });
      const body = (await res.json().catch(() => ({}))) as { style?: Style; error?: string; topUpUrl?: string };
      if (!res.ok || !body.style) { setErr({ msg: body.error ?? "Something went wrong. Try again.", topUp: body.topUpUrl }); return; }
      onStyle(body.style);
      setAbout("");
    } catch {
      setErr({ msg: "Couldn't reach the server. Check your connection and try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grow">
      <label className="field">
        <span>Grow a style from words</span>
        <div className="grow-row">
          <input value={about} onChange={(e) => setAbout(e.target.value)} placeholder="rust and gold, autumn" maxLength={300}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void grow(); } }} />
          <button className="btn btn-primary btn-sm" type="button" disabled={busy} onClick={() => void grow()}>{busy ? "Growing…" : "Grow"}</button>
        </div>
      </label>
      <div className="ideas">
        {IDEAS.map((i) => <button key={i} type="button" className="idea" disabled={busy} onClick={() => { setAbout(i); void grow(i); }}>{i}</button>)}
      </div>
      {err && <p className="err" role="alert">{err.msg}{err.topUp && <> <a href={err.topUp} target="_blank" rel="noopener noreferrer">Top up on publik</a></>}</p>}
      <PublikChoice />
      {ownKey && (
        <label className="field">
          <span>Your Anthropic API key <em className="muted">(kept in this tab only)</em></span>
          <input type="password" autoComplete="off" value={key} placeholder="sk-ant-…"
            onChange={(e) => { setKey(e.target.value); try { sessionStorage.setItem("seedbed:key", e.target.value); } catch { /* ignore */ } }} />
        </label>
      )}
    </div>
  );
}
