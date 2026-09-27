// ── Prompt Magic · tipi centrali ──────────────────────────────────────────

export type LLMCategory =
  | 'chat'
  | 'code'
  | 'search'
  | 'image'
  | 'music'
  | 'agent'
  | 'open';

export interface LLMProfile {
  id: string; // slug stabile: 'chatgpt' | 'claude' | ...
  name: string;
  provider: string;
  modelVersion: string;
  category: LLMCategory;
  description: string;
  isCurated: boolean;
  isCustom?: boolean;
  updatedAt: string; // ISO
  sourceCount: number;
}

export interface PreferredStructure {
  sections: string[];
}

export interface FewShot {
  input: string;
  output: string;
}

export interface LLMKnowledge {
  profileId: string;
  version: number;
  systemPromptStyle: string;
  preferredStructure: PreferredStructure;
  tokenBudgetGuidance: string;
  specialTokens: string[];
  fewShotExamples: FewShot[];
  antiPatterns: string[];
  sourceUrls: string[];
  notes: string;
}

export interface GeneratedPrompt {
  profileId: string;
  profileName: string;
  prompt: string;
  charCount: number;
  estTokens: number;
}

export interface GenerationRecord {
  id: string;
  createdAt: string;
  originalPrompt: string;
  selectedIds: string[];
  results: GeneratedPrompt[];
}

export interface CustomProfileDraft {
  name: string;
  provider: string;
  modelVersion: string;
  description: string;
  category: LLMCategory;
  systemPromptStyle: string;
  tokenBudgetGuidance: string;
  specialTokens: string; // comma-separated in form
  sections: string[]; // ordered
  customSection: string;
  fewShots: FewShot[];
  antiPatterns: string; // comma-separated
  sources: string; // newline-separated
  isPublic: boolean;
}

export const CATEGORY_LABELS: Record<LLMCategory, string> = {
  chat: 'Chat',
  code: 'Codice',
  search: 'Ricerca',
  image: 'Immagini',
  music: 'Musica',
  agent: 'Agenti',
  open: 'Open weights',
};

export const EMPTY_DRAFT: CustomProfileDraft = {
  name: '',
  provider: '',
  modelVersion: '',
  description: '',
  category: 'chat',
  systemPromptStyle: 'Direttivo + Persona',
  tokenBudgetGuidance: 'Medio — completo ma senza ridondanze',
  specialTokens: '',
  sections: ['Ruolo', 'Contesto', 'Compito', 'Vincoli', 'Formato output'],
  customSection: '',
  fewShots: [{ input: '', output: '' }],
  antiPatterns: '',
  sources: '',
  isPublic: false,
};
