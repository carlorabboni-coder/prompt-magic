// ── Prompt Magic · composition engine v2 (27 Sept 2026) ───────────────────
// Output language: ENGLISH (models perform best with English framing;
// the user's content/topic is preserved verbatim in its own block).
// Per-model algorithms follow the vendors' official prompting guides.

import type { GeneratedPrompt, LLMKnowledge, LLMProfile } from '../types';

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function avoid(k: LLMKnowledge): string {
  if (!k.antiPatterns.length) return '';
  return `\nAvoid: ${k.antiPatterns.slice(0, 3).join('; ')}.`;
}

function shots(k: LLMKnowledge): string {
  const s = k.fewShotExamples.filter((x) => x.input || x.output).slice(0, 2);
  if (!s.length) return '';
  return `\n\nStyle reference:\n${s.map((x, i) => `Example ${i + 1} — Input: ${x.input}\nOutput: ${x.output}`).join('\n')}`;
}

function generic(profile: LLMProfile, k: LLMKnowledge, user: string): string {
  const secs = k.preferredStructure.sections;
  const body = secs.map((s) => `${s.toUpperCase()}:\n${user}`).join('\n\n');
  return `Optimized for ${profile.name} · knowledge v${k.version}\nStyle: ${k.systemPromptStyle}\n\n${body}${shots(k)}\n\nConstraint: ${k.tokenBudgetGuidance}.${avoid(k)}`;
}

const composers: Record<string, (_p: LLMProfile, _k: LLMKnowledge, _u: string) => string> = {
  // OpenAI: instructions FIRST, ### / """ separators, specific numbers, effort-aware
  chatgpt: (_p, k, u) =>
    `Act as a world-class expert in the required domain.\n\n### Instructions\nFollow these steps in order:\n1. State the goal in one sentence.\n2. Work through the task with explicit reasoning (request higher reasoning effort for hard problems).\n3. Deliver the result in the FORMAT below.\n\n### Constraints\n- No filler; every sentence must add value.\n- Use direct action verbs ("Generate 5 ideas", not "could you maybe help…?").\n- Use concrete numbers for length ("3–5 sentences"), never vague words.\n- If data is missing, flag it and state the most reasonable assumption.\n\n### Success criteria\nA busy non-expert understands and can act on the result in under 2 minutes.\n\n### Context\n"""\n${u}\n"""\n\n### Output format (markdown)\n## Result\n## Details\n## Next steps${shots(k)}\n\nGuidance: ${k.tokenBudgetGuidance}.${avoid(k)}`,

  // Anthropic: XML blocks, positive instructions, thinking in examples, no preamble
  claude: (_p, k, u) =>
    `<instructions>\nYou are an expert assistant: precise, honest, proactive. Reason at high effort (adaptive thinking — do NOT narrate the word "thinking", just reason), then respond directly without preamble — never start with "Here is…" or "Based on…". Use action-oriented verbs ("Change X", not "consider suggesting"). If uncertain, say "I don't know" rather than guessing. Do not overengineer: solve exactly what is asked.\n</instructions>\n<context>\n${u}\n</context>\n<input>\nThe task above. Reason inside <thinking>, then deliver the final answer inside <answer> using clean markdown.\n</input>${shots(k)}\n\nNote: ${k.tokenBudgetGuidance}.${avoid(k)}`,

  // Google: System Instruction + few-shot always + context first, task last with anchor
  gemini: (_p, k, u) =>
    `[SYSTEM INSTRUCTION — You are a senior analyst: accurate, structured, never invent. Today is 27 September 2026; use this date for any time-sensitive query.]\n\n[CONTEXT]\n${u}\n\n[EXAMPLES]\nFollow the exact format of the examples: consistent structure, tags and separators.${shots(k)}\n\n[TASK — based on the information above]\nComplete the task described in CONTEXT, then deliver with these headings:\n1. Summary (max 5 lines)\n2. Analysis\n3. Risks / limits\n4. Recommendation\n5. Success criteria (how to tell the result is good)\n\n${k.tokenBudgetGuidance}.${avoid(k)}`,

  // SpaceXAI: goal + effort + explicit verification
  grok: (_p, k, u) =>
    `Goal: ${u}\n\nReasoning effort: high — work longer on difficult parts and double-check your own answers.\nVerification: cross-check the 2 most important claims before finalizing.\nTone: sharp, direct, zero fluff. Stay accurate.${avoid(k)}`,

  // Meta: Alpaca-style instruction tuning
  meta: (_p, k, u) =>
    `### Instruction:\nComplete the task below accurately and concisely.\n\n### Input:\n${u}\n\n### Response:\n${avoid(k)}`,

  // Copilot: agent-mode brief with acceptance criteria + verify command
  copilot: (_p, _k, u) =>
    `// GOAL: ${u}\n// REPO CONTEXT: point at the relevant files/dirs (paths, not pasted code)\n// ACTION: Change the code — do not merely suggest changes.\n// DO NOT overengineer: minimal diff, touch only the files above.\n// VERBOSITY: explain in max 5 bullets.\n// ACCEPTANCE CRITERIA: typed code, edge cases handled, tests updated\n// VERIFY: run the relevant tests/build/lint and report the result\n// RULES: TypeScript strict, no implicit any, pure exported functions\n\n// Implement below the signature:`,

  // Perplexity Agent API: intensity preset + perimeter + time window + citations
  perplexity: (_p, k, u) =>
    `Research question: ${u}\n\nIntensity preset: high (deep, multi-step investigation).\nSource perimeter: official docs, changelogs and reputable benchmarks only.\nTime window: 2025–2026 (today is 27 September 2026).\nOutput: comparison table + final verdict + a separate "Uncertain / unknown" section. Cite EVERY factual claim with numbered sources [1][2][3]; never present guesses as facts.${avoid(k)}`,

  // DeepSeek: mode-first reasoning trace
  deepseek: (_p, k, u) =>
    `Mode: Think High (deliberate logical analysis; use Think Max only if the problem resists).\n\nOBJECTIVE: ${u}\n\nPLAN: list the reasoning steps first (hypotheses, checks, criteria).\nEXECUTION: carry out each step explicitly.\nFINAL ANSWER: solution + why it works + how to verify it.${shots(k)}`,

  // Qwen: ChatML + explicit language, thinking on
  qwen: (_p, k, u) =>
    `<|im_start|>system\nYou are a precise assistant. Answer in English (keep standard technical terms as-is). Show 3 brief reasoning bullets, then the final answer.<|im_end|>\n<|im_start|>user\n${u}\n\nConstraints: ${k.tokenBudgetGuidance}.<|im_end|>\n<|im_start|>assistant\n`,

  // Hermes 4: persona card + <think> toggle
  hermes: (_p, k, u) =>
    `PERSONA CARD: versatile expert, adaptive style, consistent memory of the scene.\nSCENARIO: the user asks — "${u}".\nTHINKING: <think> through hard parts only; answer directly otherwise.\nSCENE OBJECTIVE: respond usefully and stay in character.\nSTYLE: vivid but precise.\nCONSTRAINTS: no role incoherence, no lecturing.${avoid(k)}`,

  // OpenCode: AGENTS.md-native agent brief
  opencode: (_p, k, u) =>
    `GOAL: ${u}\nAGENT: build (use plan first for anything touching more than 3 files).\nFILE ALLOWLIST: only the files needed for this goal — do NOT touch unrelated code.\nALLOWED TOOLS: read, grep, glob, edit, bash (tests/build only).\nSTEPS: 1) locate files 2) minimal edit 3) verify. Keep steps independent so they parallelize.\nANTI-OVERENGINEERING: smallest diff that satisfies the goal; no drive-by refactors.\nVERIFY: run the relevant tests/build and paste the output.\nDONE WHEN: minimal diff + green verification.${avoid(k)}`,

  // Mistral: concise [INST]
  mistral: (_p, _k, u) =>
    `[INST] ${u}\nAnswer in English: concise, structured bullets, no filler. [/INST]`,

  // Suno V5.5 style: 5-part formula, 8–15 tags, BPM bands, Exclude Styles
  'suno-style': (_p, _k, u) =>
    `${u.toLowerCase().replace(/\s+/g, ' ').trim()}, [intro] [verse] [chorus] [verse] [chorus] [bridge] [chorus] [outro]\n\nSuno V5.5 rules: 5-part order (genre → mood+energy → vocals → instruments+production → BPM); 8–15 tags total, first tag weighs most; ballads 60–80 / pop 90–120 / dance 120–150 / EDM 140–180 BPM; NO real artist names; put negations in the Exclude Styles field, never in Style; end lyrics with [End].`,

  // Suno V5.5 lyrics: persona + chorus job + syllable budget + [End]
  'suno-lyrics': (_p, _k, u) =>
    `Write singable lyrics (match the topic's language).\nLyric persona: define WHO is singing and in what tone before any lines.\nTheme + POV: ${u}\nChorus job: ONE repeatable hook line carrying the single main message.\nStructure: [Verse 1] [Pre-Chorus] [Chorus] [Verse 2] [Chorus] [Bridge] [Chorus] [Outro] [End]\nSyllable budget: 8–11 per line for pop feel (13–16 rap, 4–8 chants); repeat the chorus word-for-word under each [Chorus] tag.\nRules: short lines, concrete scenes over abstractions, memorable easy-to-sing chorus. Use [brackets] for directions — never (parentheses), they get sung.`,

  // GPT Image 2: dense visual description + render params
  'chatgpt-image': (_p, _k, u) =>
    `${u.trim().replace(/\.$/, '')}, rendered in rich cinematic detail with coherent lighting, thoughtful composition and a harmonious palette. Photorealistic texture, sharp focus on the subject, atmospheric depth. Render params: high quality, 1536x1024, png. No watermark; include text in the image only if explicitly requested, lettered exactly as specified.`,
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
        profileId: p.id, version: 1, systemPromptStyle: 'Structured generic',
        preferredStructure: { sections: ['Role', 'Context', 'Task', 'Constraints', 'Output format'] },
        tokenBudgetGuidance: 'Medium', specialTokens: [], fewShotExamples: [],
        antiPatterns: [], sourceUrls: [], notes: 'Custom profile without curated knowledge.',
      };
      return composePrompt(p, fallback, userPrompt);
    }
    return composePrompt(p, k, userPrompt);
  });
}
