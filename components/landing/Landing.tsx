"use client";
// The public front door at /: seedbed, a flower hover effect for websites. Built with the taste skill's kit
// (public/assets, loaded only here) and seedbed's own colours; the plan is .taste-skill/plan.md.
// type: software (site-kind software)
// deal: hero centred, nav nav-centre, close close-type, footer footer-statement, rhythm surface-pairs, buttons arrow,
//       seedbed's own mark, lit ground sand, radius soft, palette seedbed's own (start.mjs brand), type epilogue,
//       effect line-engraving held still in the hero frame
// moments: letters-assemble in #statement
// This component holds no state, so React never redraws the static markup the kit's scripts work on. The live
// parts (the gardens, the style list, the sliders) keep their own state.
import { useEffect, useState } from "react";
import { PublikPitch } from "@/components/PublikGate";
import { Mark } from "@/components/Mark";
import { MeadowStill, HeroWindow, StylesFrame, StagesFragment, PhoneFragment, GrowFragment, ExportFragment, InstallWindow } from "./Pieces";

const REPO = "https://github.com/VedSoni-dev/seedbed";
const POST = "https://x.com/msiddique26/status/2120936635856752710";
const KIT_CSS = ["system.css", "ui/cards.css", "motion/motion.css", "backgrounds/backgrounds.css", "layout/layout.css", "ui/base.css"];
const KIT_JS = ["system.js", "motion/motion.js", "layout/layout.js"];
// <html> carries the page's type, radius, lit ground, button look and the motion layer (system.md); the two
// classes hold the hero's words for the entrance and the moment's finished state if a script is late
const HTML_ATTRS = `(function(){var d=document.documentElement;d.setAttribute('data-type','software');d.setAttribute('data-radius','soft');d.setAttribute('data-ground','sand');d.setAttribute('data-buttons','arrow');d.setAttribute('data-motion','');d.classList.add('m-enter','mo-js');setTimeout(function(){d.classList.add('m-enter-done')},700);setTimeout(function(){d.classList.add('mo-safe')},2500)})();`;

const ARROW = (
  <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true"><path className="m-arrow__stem" d="M1 6h8" /><path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" /></svg>
);

// While the publik listing is pending, one line under the pitch says so; it keeps its own state so Landing
// never re-renders, and it disappears once the listing and app token exist.
function PublikPending() {
  const [pending, setPending] = useState(false);
  useEffect(() => {
    fetch("/api/publik/status", { cache: "no-store" }).then((r) => r.json()).then((j) => setPending(j?.state === "pending")).catch(() => {});
  }, []);
  if (!pending) return null;
  return <p className="lp-pending">seedbed is coming to publik (publik caps new listings each week). Until its listing is up, the app is open to everyone with no sign-in.</p>;
}

// The launch film, once the film stage has put it at public/seedbed.mp4. Until then a still meadow on the paper card.
function Film() {
  const [has, setHas] = useState(false);
  useEffect(() => {
    fetch("/seedbed.mp4", { method: "HEAD" }).then((r) => setHas(r.ok && (r.headers.get("content-type") ?? "").startsWith("video"))).catch(() => {});
  }, []);
  if (!has) return <MeadowStill />;
  return (
    <div className="frame lp-film">
      <video src="/seedbed.mp4" poster="/opengraph-image.png" controls preload="none" playsInline aria-label="The seedbed launch film" />
    </div>
  );
}

export function Landing() {
  useEffect(() => {
    for (const f of KIT_JS) {
      const src = `/assets/${f}`;
      if (document.querySelector(`script[src="${src}"]`)) continue;
      const s = document.createElement("script");
      s.type = "module";
      s.src = src;
      document.body.append(s);
    }
  }, []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: HTML_ATTRS }} />
      {KIT_CSS.map((f) => (
        <link key={f} rel="stylesheet" href={`/assets/${f}`} precedence="taste-kit" />
      ))}
      <link rel="stylesheet" href="/assets/landing.css" precedence="taste-page" />
      <link rel="modulepreload" href="/assets/moments/moments.js" />
      <link rel="modulepreload" href="/assets/moments/lib.js" />
      <link rel="modulepreload" href="/assets/moments/letters-assemble/moment.js" />

      <header className="nav nav--centre">
        <div className="wrap nav__bar">
          <a className="skip-link" href="#top">Skip to content</a>
          <a className="nav__logo" href="#top"><span className="lp-mark"><Mark /></span>seedbed</a>
          <nav className="nav__links" aria-label="Main">
            <div className="nav__item"><a className="nav__link" href="#styles">Styles</a></div>
            <div className="nav__item"><a className="nav__link" href="#features">Features</a></div>
            <div className="nav__item"><a className="nav__link" href="#install">Install</a></div>
            <div className="nav__item"><a className="nav__link" href="#questions">Questions</a></div>
          </nav>
          <div className="nav__actions">
            <a className="btn btn--primary" href="/app">Start a garden</a>
          </div>
          <button className="nav__toggle" type="button" aria-expanded="false" aria-label="Menu">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
      </header>

      <main id="top">
        {/* HERO: centred. The words, then the live garden rising out of the engraved hills. */}
        <section className="hero hero--centred" data-enter aria-labelledby="hero-h">
          <div className="wrap">
            <div className="hero-text">
              <div className="hero__c">
                <a className="pill" href={`${REPO}/blob/main/LICENSE`}><span>Free and open source</span><span className="muted">MIT licence</span></a>
                <h1 id="hero-h">Flower hover effect for your website</h1>
                <p className="hero__lead">
                  Move across a grid of dots and flowers grow out of them, then wilt back. Five styles, one 21 KB file, no dependencies.
                </p>
                <div className="btn-row">
                  <a className="btn btn--primary" href="/app">Start a garden{ARROW}</a>
                  <a className="btn btn--secondary" href={REPO}>Read the source</a>
                </div>
              </div>
              <div className="hero__window" data-fx="line-engraving" data-fx-seed="7">
                <HeroWindow />
              </div>
            </div>
          </div>
        </section>

        {/* STYLES: app-frame. The h2 left, the paragraph right, then the app across the wrap, live. */}
        <section className="section" id="styles" aria-labelledby="styles-h">
          <div className="wrap">
            <div className="grid grid--top">
              <h2 id="styles-h" className="span-5">Five garden styles and your own</h2>
              <p className="t-lead muted span-6 start-7">
                Pick a style on the left and the garden redraws on the right. Drag a slider and the next bloom grows to it.
              </p>
            </div>
            <StylesFrame />
          </div>
        </section>

        {/* FEATURES: one 2x2, two screens, every panel on the lit ground, held still */}
        <section className="section" id="features" style={{ "--h": 2 } as React.CSSProperties} aria-labelledby="features-h">
          <div className="wrap">
            <div className="group">
              <div className="section-head">
                <h2 id="features-h">
                  What seedbed draws and ships. <span className="muted">Every flower grows on one canvas, from about 470 lines of JavaScript.</span>
                </h2>
              </div>
              <div className="grid">
                <article className="card card--row card--open span-6 m-nolift">
                  <h3>Grows a stem, then leaves, then the flower</h3>
                  <p>Each dot starts on its own short delay and wilts back in the same order.</p>
                  <div className="panel"><div className="stage"><StagesFragment /></div></div>
                </article>
                <article className="card card--row card--open span-6 m-nolift">
                  <h3>Grows the garden under a finger on phones</h3>
                  <p>Touch drag works like a cursor. With reduced motion, flowers open at once.</p>
                  <div className="panel"><div className="stage"><PhoneFragment /></div></div>
                </article>
                <article className="card card--row card--open span-6 m-nolift">
                  <h3>Turns a sentence into a style</h3>
                  <p>Describe a mood and AI picks the petals, stems and paper colour.</p>
                  <div className="panel"><div className="stage"><GrowFragment /></div></div>
                </article>
                <article className="card card--row card--open span-6 m-nolift">
                  <h3>Copies as a web component or React</h3>
                  <p>The code carries your settings, so it looks the same on your site.</p>
                  <div className="panel"><div className="stage"><ExportFragment /></div></div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* STATEMENT: letters-assemble (moments.md), one screen of its own */}
        <section className="section" id="statement" data-moment="letters-assemble" aria-labelledby="statement-h">
          <div className="wrap">
            <h2 id="statement-h" className="mo-la__type">One file, any website</h2>
            <p className="mo-la__sub">seedbed.js has no dependencies. It loads nothing and sends nothing, so it runs in plain HTML, React, Vue, Svelte or a Webflow embed.</p>
          </div>
        </section>

        {/* INSTALL: split-text-left on the surface ground. Three steps beside the tag, running. */}
        <section className="section ground-surface" id="install" aria-labelledby="install-h">
          <div className="wrap">
            <div className="grid grid--top">
              <div className="span-5 stack-5">
                <h2 id="install-h">Install the garden with two lines</h2>
                <p className="t-lead">The garden on the right is the tag on the left, loaded from this site.</p>
                <ul className="rows">
                  <li><span className="rows__name">Add the script</span><p>Save seedbed.js beside your page and load it as a module.</p></li>
                  <li><span className="rows__name">Place the tag</span><p>Give seedbed-garden a height. The garden fills its box.</p></li>
                  <li><span className="rows__name">Set the style</span><p>preset, radius, wilt-delay and density are plain attributes.</p></li>
                </ul>
              </div>
              <div className="frame frame--split frame--lit span-6 start-7">
                <InstallWindow />
              </div>
            </div>
          </div>
        </section>

        {/* QUESTIONS: every answer open, the limits said plainly; the publik pitch and the film beside them */}
        <section className="section g2m" id="questions" aria-labelledby="questions-h">
          <div className="wrap">
            <div className="grid grid--top">
              <div className="span-5 stack-5">
                <h2 id="questions-h">Questions</h2>
                <PublikPitch appName="seedbed" className="lp-pitch" />
                <PublikPending />
                <Film />
              </div>
              <div className="faq span-6 start-7">
                <div className="faq__item">
                  <h3>Who designed the hover garden?</h3>
                  <p>Mohamed Siddique showed it in <a className="link" href={POST}>a design post</a>. seedbed rebuilds the idea from scratch, with its own flowers, hills and styles.</p>
                </div>
                <div className="faq__item">
                  <h3>Can I use the garden on a client website?</h3>
                  <p>Yes. seedbed is MIT licensed, so you can ship it in paid work. Keep the licence line in seedbed.js.</p>
                </div>
                <div className="faq__item">
                  <h3>Will the garden slow my website down?</h3>
                  <p>It draws on one canvas and sleeps when nothing moves, when it is off screen or when the tab is hidden.</p>
                </div>
                <div className="faq__item">
                  <h3>What is missing from the component?</h3>
                  <p>An npm package, image or video export, share links, and Vue or Svelte wrappers. The tag works in both today.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer closing footer--statement" id="contact" aria-labelledby="close-h">
        <div className="wrap">
          <div className="closing__cta close--type">
            <div className="section-head">
              <h2 id="close-h">Plant your first garden</h2>
              <p>Free and MIT licensed. Your gardens stay in this browser.</p>
            </div>
            <a className="btn btn--primary btn--xl btn--wide" href="/app">Start a garden{ARROW}</a>
          </div>
          <div className="closing__links">
            <div className="grid">
              <div className="span-4 stack-4">
                <a className="nav__logo" href="#top"><span className="lp-mark"><Mark /></span>seedbed</a>
                <p className="footer__lede">Flowers that grow under the cursor, for any website.</p>
              </div>
              <div className="span-2 footer__col">
                <h3>seedbed</h3>
                <ul>
                  <li><a href="#styles">Styles</a></li>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#install">Install</a></li>
                </ul>
              </div>
              <div className="span-2 footer__col">
                <h3>Help</h3>
                <ul>
                  <li><a href="#questions">Questions</a></li>
                  <li><a href={`${REPO}/issues`}>Issues</a></li>
                </ul>
              </div>
              <div className="span-2 footer__col">
                <h3>Code</h3>
                <ul>
                  <li><a href={REPO}>Read the source</a></li>
                  <li><a href={`${REPO}/blob/main/LICENSE`}>MIT licence</a></li>
                </ul>
              </div>
              <div className="span-2 footer__col">
                <h3>More</h3>
                <ul>
                  <li><a href="https://publikhq.com">publik</a></li>
                  <li><a href="https://x.com/forkthis_ai">@forkthis_ai</a></li>
                </ul>
              </div>
            </div>
            <div className="footer__legal">
              <span>&copy; 2026 seedbed. Hover garden idea by Mohamed Siddique; not affiliated.</span>
              <div className="socials" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
