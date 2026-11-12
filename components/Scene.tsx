import type { Style } from "@/lib/seedbed.js";

/** Our own landscape: a sky gradient, layered hills and a grain overlay, all SVG. Night swaps the sky. */
export function SceneBg({ night = false }: { night?: boolean }) {
  const sky = night ? ["#0e1530", "#2a2f5c"] : ["#7fb0de", "#cfe3ef"];
  const hills = night ? ["#3b3f63", "#2a3b4a", "#1b2b25"] : ["#e59a7c", "#a3a85c", "#3d6a46"];
  return (
    <svg className="scene-bg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} />
        </linearGradient>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .22 0" /></filter>
      </defs>
      <rect width="1200" height="600" fill="url(#sky)" style={{ transition: "fill .6s" }} />
      {night
        ? <g fill="#fff" opacity=".7">{[[120, 70], [300, 120], [520, 60], [760, 110], [980, 50], [1100, 140], [640, 160], [220, 190]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 ? 1.2 : 1.8} />)}</g>
        : <g fill="#fff" opacity=".55"><ellipse cx="230" cy="110" rx="120" ry="22" /><ellipse cx="300" cy="95" rx="70" ry="24" /><ellipse cx="930" cy="80" rx="140" ry="20" /><ellipse cx="1000" cy="66" rx="60" ry="20" /></g>}
      <path d="M0 330 C 160 270 320 300 460 330 S 760 280 900 300 S 1120 340 1200 310 V600 H0Z" fill={hills[0]} />
      <path d="M0 420 C 200 360 360 400 520 410 S 820 360 1000 390 S 1150 420 1200 400 V600 H0Z" fill={hills[1]} />
      <path d="M0 500 C 180 460 420 500 600 490 S 960 450 1200 480 V600 H0Z" fill={hills[2]} />
      <rect width="1200" height="600" filter="url(#grain)" />
    </svg>
  );
}

export function SkyIcon({ night }: { night: boolean }) {
  return night ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
  );
}

export function Swatch({ style }: { style: Style }) {
  return (
    <span className="swatch" aria-hidden="true" style={{ background: style.card }}>
      {style.petals.slice(0, 3).map((c, i) => <i key={i} style={{ background: c }} />)}
    </span>
  );
}

/** Text colour that reads on a card colour. */
export function inkFor(hex: string) {
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 140 ? "#23211d" : "#eef0f6";
}
