import Link from "next/link";
import { LandingDemo } from "@/components/LandingDemo";
import { PublikPitch } from "@/components/PublikGate";
import "./landing.css";

const POST = "https://x.com/msiddique26/status/2120936635856752710";
const REPO = "https://github.com/VedSoni-dev/seedbed";

const SNIPPET = `<script type="module" src="./seedbed.js"></script>

<seedbed-garden preset="tulip" radius="160"
  style="height:320px"></seedbed-garden>`;

export default function Landing() {
  return (
    <>
      <header className="wrap nav">
        <Link href="/" className="logo"><img src="/icon.svg" alt="" width={26} height={26} />seedbed</Link>
        <nav>
          <a href={REPO} target="_blank" rel="noopener noreferrer">GitHub</a>
          <Link className="btn btn-primary btn-sm" href="/app">Open seedbed →</Link>
        </nav>
      </header>

      <main>
        <section className="wrap hero">
          <h1>A garden that grows<br />under your cursor.</h1>
          <p className="lede">
            A quiet grid of dots for your website. Move across it and flowers grow up out of the dots, then wilt back
            when you move on. Five styles, live controls, and one file to paste into your own site. Free and MIT.
          </p>
          <div className="cta">
            <Link className="btn btn-primary" href="/app">Open seedbed →</Link>
            <a className="btn" href={REPO} target="_blank" rel="noopener noreferrer">Get the code</a>
          </div>
          <div id="demo" className="hero-demo"><LandingDemo /></div>
        </section>

        <section className="wrap how">
          <div>
            <h2>Paste it into any site</h2>
            <p className="muted">
              seedbed is one dependency-free file. Add the script, drop in the tag, give it a height. It works in plain HTML,
              React, Vue, Svelte, Webflow embeds, anywhere a custom element runs. Nothing is fetched and nothing is tracked.
            </p>
            <ul className="works">
              <li>Each dot grows a stem, then leaves, then the flower opens; it wilts back in the same order</li>
              <li>A comet tail of half-grown plants follows a moving cursor</li>
              <li>Meadow, Tulip, Lavender, Ink and Night, or grow your own style from a sentence</li>
              <li>Radius, height, speed, wilt delay, density and spacing, all live</li>
              <li>Touch drag on phones; calm, instant blooms for reduced motion</li>
              <li>Sleeps when nothing moves, offscreen, or in a background tab</li>
            </ul>
          </div>
          <pre aria-label="Install snippet"><code>{SNIPPET}</code></pre>
        </section>

        <section className="wrap steps">
          <h2>In the app</h2>
          <ol>
            <li><b>Start a garden.</b> Name it after the site it is for and pick a style to begin with.</li>
            <li><b>Tune it.</b> Switch styles, flip to night, or describe a mood (“rust and gold, autumn”) and AI grows a palette for you. Drag the sliders until it feels right.</li>
            <li><b>Copy it.</b> A web component, a React file or a one-line CDN tag, with your settings already in it.</li>
          </ol>
          <Link className="btn btn-primary" href="/app">Open seedbed →</Link>
        </section>

        <section className="wrap publik" aria-labelledby="publik-h">
          <h2 id="publik-h">Free, because of publik</h2>
          <PublikPitch appName="seedbed" className="pk-pitch landing-pitch" />
        </section>

      </main>

      <footer className="wrap foot">
        <p className="credit-line">
          seedbed is a from-scratch, open-source rebuild of a hover-garden design experiment by Mohamed Siddique,{" "}
          <a href={POST} target="_blank" rel="noopener noreferrer">shown in his post</a>. The idea is his; the code, the
          flowers, the landscape and the styles here are new and drawn in code.
        </p>
        <span>free &amp; open source · MIT · not affiliated with Mohamed Siddique</span>
        <span>Built by <a href="https://x.com/forkthis_ai" target="_blank" rel="noopener noreferrer">@forkthis_ai</a></span>
      </footer>
    </>
  );
}
