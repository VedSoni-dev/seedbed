import { cookies } from "next/headers";
import { MODELS, publikChat, resolveProvider } from "@/lib/publik";
import { normalizeStyle } from "@/lib/seedbed.js";

/*
 * "Grow a style from words": one sentence about a mood or a site → a seedbed style (card, dots, stems, petals, head shapes).
 * publik API when the person chose "Connect your plan" (the key stays in its sealed cookie on the server),
 * otherwise their own Anthropic key from a request header, used for this one call and never stored.
 * Whatever the model says goes through normalizeStyle(), so a bad colour can never reach the garden.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM = `You design colour styles for a hover garden: a dot grid on a card where small flowers grow out of the dots.
Given a short description (a mood, a season, a brand, a site), reply with JSON only, no prose:
{"label": string (1-2 words), "card": "#rrggbb" (the card background), "dot": "#rrggbb" (the resting dots, low contrast against the card),
 "stem": "#rrggbb", "leaf": "#rrggbb", "petals": ["#rrggbb", ... 3 to 6 colours], "center": "#rrggbb",
 "heads": [1 to 4 of "cosmos" | "daisy" | "tulip" | "spike"], "line": boolean (true only for monochrome line-art looks), "glow": number 0-10 (0 unless it is a night or neon look)}
Petals must read clearly against the card. Stems and leaves are plant greens unless the description asks otherwise.`;

const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

function parse(text: string) {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    const raw = JSON.parse(m[0]);
    if (!raw || typeof raw !== "object" || !Array.isArray(raw.petals)) return null;
    return normalizeStyle(raw);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const ownKey = req.headers.get("x-anthropic-key")?.trim();
  const p = resolveProvider(await cookies(), ownKey ? { baseURL: "https://api.anthropic.com", apiKey: ownKey } : null);
  if (p.kind === "needs_own_key") return json({ error: "Add your Anthropic API key below, or switch to your publik plan." }, 401);

  let about = "";
  try {
    const b = (await req.json()) as { about?: unknown };
    about = String(b.about ?? "").trim().slice(0, 300);
  } catch {
    return json({ error: "Bad request." }, 400);
  }
  if (!about) return json({ error: "Describe a mood first, like “autumn maple, rust and gold”." }, 400);

  let text = "";
  if (p.kind === "publik") {
    const r = await publikChat(p, { model: MODELS.fast, max_tokens: 500, messages: [{ role: "system", content: SYSTEM }, { role: "user", content: about }] }, req.signal);
    if (!r.ok) return json({ error: r.message, ...(r.topUpUrl ? { topUpUrl: r.topUpUrl } : {}) }, r.status);
    text = r.text;
  } else {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": p.apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-5-5", max_tokens: 500, system: SYSTEM, messages: [{ role: "user", content: about }] }),
      signal: req.signal,
    }).catch(() => null);
    if (!res) return json({ error: "Couldn't reach Anthropic. Try again." }, 502);
    const body = (await res.json().catch(() => ({}))) as { content?: { text?: string }[]; error?: { message?: string } };
    if (!res.ok) return json({ error: body.error?.message ?? `Anthropic answered ${res.status}.` }, res.status === 401 ? 401 : 502);
    text = (body.content ?? []).map((c) => c.text ?? "").join("");
  }
  const style = parse(text);
  return style ? json({ style }) : json({ error: "The model's answer wasn't a usable style. Try a few more words." }, 502);
}
