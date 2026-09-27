// ── Prompt Magic · storage locale (fallback + cache) ──────────────────────
import type { GenerationRecord, LLMProfile, LLMKnowledge } from '../types';
import { CURATED_KNOWLEDGE, CURATED_PROFILES } from '../data/seedKnowledge';

const K_CUSTOM = 'pm.customProfiles.v1';
const K_KNOWLEDGE = 'pm.customKnowledge.v1';
const K_HISTORY = 'pm.history.v1';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage pieno o non disponibile: ignora */
  }
}

export function loadCustomProfiles(): LLMProfile[] {
  return read<LLMProfile[]>(K_CUSTOM, []);
}

export function saveCustomProfiles(list: LLMProfile[]): void {
  write(K_CUSTOM, list);
}

export function loadCustomKnowledge(): Record<string, LLMKnowledge> {
  return read<Record<string, LLMKnowledge>>(K_KNOWLEDGE, {});
}

export function saveCustomKnowledge(map: Record<string, LLMKnowledge>): void {
  write(K_KNOWLEDGE, map);
}

export function allProfiles(): LLMProfile[] {
  return [...CURATED_PROFILES, ...loadCustomProfiles()];
}

export function allKnowledge(): Record<string, LLMKnowledge> {
  return { ...CURATED_KNOWLEDGE, ...loadCustomKnowledge() };
}

export function loadHistory(): GenerationRecord[] {
  return read<GenerationRecord[]>(K_HISTORY, []);
}

export function pushHistory(rec: GenerationRecord): GenerationRecord[] {
  const list = [rec, ...loadHistory()].slice(0, 100);
  write(K_HISTORY, list);
  return list;
}

export function clearHistory(): void {
  write(K_HISTORY, []);
}

export function deleteHistory(id: string): GenerationRecord[] {
  const list = loadHistory().filter((h) => h.id !== id);
  write(K_HISTORY, list);
  return list;
}
