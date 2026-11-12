"use client";
import type { Options, Style } from "@/lib/seedbed.js";

export type GardenDoc = { id: string; name: string; options: Partial<Options>; styles: Style[]; created: number };
export type Store = { gardens: GardenDoc[]; current: string | null; howtoDone: boolean };

const KEY = "seedbed:v1";
const empty: Store = { gardens: [], current: null, howtoDone: false };

export function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...empty };
    const s = JSON.parse(raw) as Store;
    if (!Array.isArray(s.gardens)) return { ...empty };
    return { gardens: s.gardens, current: s.current ?? s.gardens[0]?.id ?? null, howtoDone: !!s.howtoDone };
  } catch {
    return { ...empty };
  }
}

export function save(s: Store) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode: the session still works */ }
}

export const newId = () => Math.random().toString(36).slice(2, 10);
