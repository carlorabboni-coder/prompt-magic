// ── Prompt Magic · motore di composizione prompt ──────────────────────────
// OPTIMIZED = [PRIMER] + [STRUTTURA] + [PROMPT UTENTE ARRICCHITO] + [ESEMPI] + [VINCOLI]
// Ogni profilo ha un composer dedicato; il fallback usa la struttura generica.

import type { GeneratedPrompt, LLMKnowledge, LLMProfile } from '../types';

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function header(name: string, version: number): string {
  return `Ottimizzato per ${name} · knowledge v${version}`;
}

function withAnti(knowledge: LLMKnowledge): string {
  if (!knowledge.antiPatterns.length) return '';
  return `\nEvita: ${knowledge.antiPatterns.slice(0, 3).join('; ')}.`;
}

function withShots(knowledge: LLMKnowledge): string {
  const shots = knowledge.fewShotExamples.filter((s) => s.input || s.output).slice(0, 2);
  if (!shots.length) return '';
  return `\n\nRiferimento di stile:\n${shots.map((s, i) => `Esempio ${i + 1} — Input: ${s.input}\nOutput: ${s.output}`).join('\n')}`;
}

function generic(profile: LLMProfile, k: LLMKnowledge, user: string): string {
  const secs = k.preferredStructure.sections;
  const body = secs.map((s) => `${s.toUpperCase()}:\n${user}`).join('\n\n');
  return `${header(profile.name, k.version)}\nStile: ${k.systemPromptStyle}\n\n${body}${withShots(k)}\n\nVincolo: ${k.tokenBudgetGuidance}.${withAnti(k)}`;
}

const composers: Record<string, (_p: LLMProfile, _k: LLMKnowledge, _u: string) => string> = {
  chatgpt: (_p, k, u) =>
    `Agisci come un esperto di livello mondiale nel dominio richiesto.\n\nCONTESTO:\n${u}\n\nCOMPITO — esegui questi passi:\n1. Chiarisci l'obiettivo in 1 frase.\n2. Svolgi il compito con ragionamento esplicito.\n3. Consegna il risultato nel FORMATO qui sotto.\n\nVINCOLI:\n- Niente riempitivo; ogni frase aggiunge valore.\n- Se un dato manca, segnalalo e proponi l'assunzione più ragionevole.\n\nFORMATO OUTPUT (markdown):\n## Risultato\n## Dettagli\n## Prossimi passi${withShots(k)}\n\nGuida: ${k.tokenBudgetGuidance}.${withAnti(k)}`,

  claude: (_p, k, u) =>
    `<ruolo>Sei un assistente esperto, preciso e onesto.</ruolo>\n<contesto>${u}</contesto>\n<compito>Svolgi il compito sopra. Ragiona passo-passo dentro <ragionamento>, poi consegna la risposta finale dentro <risposta> usando markdown pulito.</compito>${withShots(k)}\n\nNota: ${k.tokenBudgetGuidance}.${withAnti(k)}`,

  gemini: (_p, k, u) =>
    `[SYSTEM INSTRUCTION — Sei un analista senior: accurato, strutturato, senza invenzioni.]\n\n[USER]\nContesto e compito:\n${u}\n\nConsegna con queste intestazioni:\n1. Sintesi (≤5 righe)\n2. Analisi\n3. Rischi / limiti\n4. Raccomandazione${withShots(k)}\n\n${k.tokenBudgetGuidance}.${withAnti(k)}`,

  grok: (_p, k, u) =>
    `Obiettivo: ${u}\n\nTono: diretto, arguto, zero fuffa. Vai dritto al punto ma resta accurato.${withAnti(k)}`,

  meta: (_p, k, u) =>
    `### Instruction:\nSvolgi il compito sotto in modo accurato e conciso, in italiano.\n\n### Input:\n${u}\n\n### Response:\n${withAnti(k)}`,

  copilot: (_p, _k, u) =>
    `// OBIETTIVO: ${u}\n// REGOLE: TypeScript strict, niente any impliciti, gestisci gli errori, esporta funzioni pure.\n// ESEMPIO I/O ATTESO: input tipizzato → output tipizzato + test rapido.\n\n// Scrivi sotto la firma, poi l'implementazione:`,

  perplexity: (_p, k, u) =>
    `Domanda di ricerca: ${u}\n\nPerimetro: fonti ufficiali e documentazione aggiornata (2025–2026).\nProfondità: confronto critico, non elenco.\nFormato: tabella comparativa + verdetto finale con citazioni numerate [1][2][3].${withAnti(k)}`,

  deepseek: (_p, k, u) =>
    `OBIETTIVO: ${u}\n\nPIANO: elenca prima i passi di ragionamento (ipotesi, verifiche, criteri).\nESECUZIONE: svolgi ogni passo esplicitamente.\nRISPOSTA FINALE: soluzione + perché funziona + come verificarla.${withShots(k)}`,

  qwen: (_p, k, u) =>
    `<|im_start|>system\nSei un assistente preciso. Rispondi in italiano (termini tecnici in inglese quando standard).<|im_end|>\n<|im_start|>user\n${u}\n\nVincoli: ${k.tokenBudgetGuidance}.<|im_end|>\n<|im_start|>assistant\n`,

  hermes: (_p, k, u) =>
    `PERSONAGGIO: esperto versatile, stile adattivo, memoria della scena.\nSCENARIO: l'utente chiede — "${u}".\nOBIETTIVO SCENA: rispondere in modo utile e coerente col personaggio.\nSTILE: vivido ma preciso.\nVINCOLI: niente incoerenze di ruolo.${withAnti(k)}`,

  opencode: (_p, k, u) =>
    `GOAL: ${u}\nTOOLS CONSENTITI: read, grep, glob, edit, bash (test/build).\nSTEPS: 1) localizza i file 2) modifica minima 3) verifica.\nVERIFY: esegui test/build rilevanti e riporta l'output.\nDONE QUANDO: diff minima + verifica verde.${withAnti(k)}`,

  mistral: (_p, _k, u) =>
    `[INST] ${u}\nRispondi in italiano, conciso e strutturato con bullet. [/INST]`,

  'suno-style': (_p, _k, u) =>
    `${u.toLowerCase().replace(/\s+/g, ' ').trim()}, [intro] [verse] [chorus] [verse] [chorus] [bridge] [chorus] [outro]\n\nRegole Suno: niente nomi di artisti reali; tag concreti (genere, mood, strumenti, BPM, tonalità); style <200 caratteri; aggettivi vaghi → sostituiscili con riferimenti sonori.`,

  'suno-lyrics': (_p, _k, u) =>
    `Scrivi un testo cantabile in italiano.\nTopic: ${u}\nStruttura: [Verse 1] [Chorus] [Verse 2] [Chorus] [Bridge] [Chorus] [Outro]\nSchema rima: strofe ABAB, ritornello con rime semplici e ripetibili.\nRegole: versi brevi (≤10 sillabe), ritornello memorabile e facile da cantare, linguaggio concreto ed emotivo.`,

  'chatgpt-image': (_p, _k, u) =>
    `${u.trim().replace(/\.$/, '')}, rendered in rich cinematic detail with coherent lighting, thoughtful composition and a harmonious palette. Photorealistic texture, sharp focus on the subject, atmospheric depth, no text or watermark.`,
};

export function composePrompt(profile: LLMProfile, knowledge: LLMKnowledge, userPrompt: string): GeneratedPrompt {
  const fn = composers[profile.id] ?? generic;
  const prompt = fn(profile, knowledge, userPrompt.trim());
  return {
    profileId: profile.id,
    profileName: profile.name,
    prompt,
    charCount: prompt.length,
    estTokens: estimateTokens(prompt),
  };
}

export function composeAll(
  profiles: LLMProfile[],
  knowledgeMap: Record<string, LLMKnowledge>,
  userPrompt: string,
): GeneratedPrompt[] {
  return profiles.map((p) => {
    const k = knowledgeMap[p.id];
    if (!k) {
      const fallback: LLMKnowledge = {
        profileId: p.id, version: 1, systemPromptStyle: 'Generico strutturato',
        preferredStructure: { sections: ['Ruolo', 'Contesto', 'Compito', 'Vincoli', 'Formato output'] },
        tokenBudgetGuidance: 'Medio', specialTokens: [], fewShotExamples: [],
        antiPatterns: [], sourceUrls: [], notes: 'Profilo custom senza knowledge curata.',
      };
      return composePrompt(p, fallback, userPrompt);
    }
    return composePrompt(p, k, userPrompt);
  });
}
