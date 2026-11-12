"use client";
import { useEffect, useState } from "react";
import { Garden } from "@/components/Garden";
import { SceneBg, SkyIcon, Swatch, inkFor } from "@/components/Scene";
import { PRESETS, type PresetKey } from "@/lib/seedbed.js";

const KEYS: PresetKey[] = ["meadow", "tulip", "lavender", "ink"];

/** The landing hero: the real engine on a paper card. Styles switch live; the sun flips it to night. */
export function LandingDemo() {
  const [preset, setPreset] = useState<PresetKey>("meadow");
  const [night, setNight] = useState(false);
  const [touched, setTouched] = useState(false);
  const [touch, setTouch] = useState(false);
  useEffect(() => { setTouch(matchMedia("(hover: none)").matches); }, []);
  const style = night ? PRESETS.night : PRESETS[preset];
  return (
    <div>
      <div className="scene">
        <SceneBg night={night} />
        <div className="paper" style={{ ["--paper" as string]: style.card, ["--paper-ink" as string]: inkFor(style.card) }}>
          <div className="paper-head">
            <div className="who"><span className="avatar">JS</span>Juniper Studio</div>
            <button className="sky-toggle" type="button" aria-label={night ? "Switch to day" : "Switch to night"} onClick={() => setNight((n) => !n)}>
              <SkyIcon night={night} />
            </button>
          </div>
          <div className="bed" onPointerMove={() => setTouched(true)} onPointerDown={() => setTouched(true)}>
            <Garden options={{ preset, night, ghost: true }} />
            <span className="hint" style={{ opacity: touched ? 0 : 1 }}>{touch ? "drag your finger across the dots" : "move your cursor across the dots"}</span>
          </div>
          <div className="paper-copy">
            <h2>Hover to bloom.</h2>
            <p>Every dot is a seed. Move across them and a small meadow follows you, then folds back into the grid.</p>
          </div>
        </div>
      </div>
      <div className="chips demo-chips" role="group" aria-label="Try a style">
        {KEYS.map((k) => (
          <button key={k} type="button" className="chip" aria-pressed={!night && preset === k} onClick={() => { setPreset(k); setNight(false); }}>
            <Swatch style={PRESETS[k]} />{PRESETS[k].label}
          </button>
        ))}
        <button type="button" className="chip" aria-pressed={night} onClick={() => setNight(true)}>
          <Swatch style={PRESETS.night} />Night
        </button>
      </div>
    </div>
  );
}
