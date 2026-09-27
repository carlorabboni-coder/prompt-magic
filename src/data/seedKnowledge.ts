// ── Prompt Magic · knowledge base seed v2 (27 settembre 2026) ────────────
// Ricerca online del 27/09/2026: versioni, pricing e guide ufficiali aggiornate.
// Changelog v1→v2:
//  chatgpt: GPT-4o → GPT-6 Astra (flagship 03/09/2026) + tier Sol/Luna
//  claude: 3.5 Sonnet → Opus 5.5 (22/09/2026) + adaptive thinking a effort
//  gemini: 1.5 Pro → 3.8 Flash (02/09/2026) + strategie prompting ufficiali
//  grok: Grok-2 → Grok 4.7 (21/09/2026, SpaceXAI) + reasoning effort
//  meta: Llama 3.1 70B → Llama 4 Maverick (MoE 400B/17B, 1M ctx)
//  copilot: single-model → multi-model picker + agent mode (sett 2026)
//  perplexity: Sonar → Agent API (Sonar deprecata il 27/09/2026) + preset
//  deepseek: V3/R1 → V4.1-Flash (10/09/2026) + V4-Pro-0813, 3 thinking mode
//  qwen: 2.5/3 → Qwen3.8-Max (08/2026, 2.4T); Qwen 4 annunciato 22/09
//  hermes: Hermes 3 → Hermes 4 hybrid reasoning + toggle <think>
//  opencode: generico → v1.18.x, AGENTS.md, agent build/plan, --variant
//  mistral: Large 2 → Medium 3.5 (128B open, coding flagship)
//  suno: v4 → V5.5 (26/03/2026): formula 5-part, 8-15 tag, Exclude Styles
//  chatgpt-image: DALL·E 3 (deprecata) → GPT Image 2 (gpt-image-2, 04/2026)

import type { LLMKnowledge, LLMProfile } from '../types';

const NOW = new Date().toISOString();

export const CURATED_PROFILES: LLMProfile[] = [
  {
    id: 'chatgpt', name: 'ChatGPT', provider: 'openai', modelVersion: 'GPT-6 Astra',
    category: 'chat', description: 'Flagship Sept 2026: instructions first, ###/""" separators, reasoning effort.',
    isCurated: true, updatedAt: NOW, sourceCount: 26,
  },
  {
    id: 'claude', name: 'Claude', provider: 'anthropic', modelVersion: 'Opus 5.5',
    category: 'chat', description: 'Adaptive thinking by effort, XML tags, positive instructions, 3–5 examples.',
    isCurated: true, updatedAt: NOW, sourceCount: 24,
  },
  {
    id: 'gemini', name: 'Gemini', provider: 'google', modelVersion: '3.8 Flash',
    category: 'chat', description: 'System Instruction first, always few-shot, context-first + task-last.',
    isCurated: true, updatedAt: NOW, sourceCount: 21,
  },
  {
    id: 'grok', name: 'Grok', provider: 'spacexai', modelVersion: 'Grok 4.7',
    category: 'chat', description: 'Coding + knowledge work, 500K context, configurable reasoning effort.',
    isCurated: true, updatedAt: NOW, sourceCount: 13,
  },
  {
    id: 'meta', name: 'Meta AI (Llama)', provider: 'meta', modelVersion: 'Llama 4 Maverick',
    category: 'open', description: 'Open MoE 400B/17B active, 1M context, ### Instruction / ### Response.',
    isCurated: true, updatedAt: NOW, sourceCount: 15,
  },
  {
    id: 'copilot', name: 'Copilot', provider: 'microsoft', modelVersion: 'Multi-model (GPT-6 · Claude · Gemini)',
    category: 'code', description: 'Model picker + agent mode: goal, repo context, accept criteria, tests.',
    isCurated: true, updatedAt: NOW, sourceCount: 15,
  },
  {
    id: 'perplexity', name: 'Perplexity', provider: 'perplexity', modelVersion: 'Agent API',
    category: 'search', description: 'Sonar retired 27/09/2026: Agent API presets, Search as Code, citations.',
    isCurated: true, updatedAt: NOW, sourceCount: 14,
  },
  {
    id: 'deepseek', name: 'DeepSeek', provider: 'deepseek', modelVersion: 'V4.1-Flash + V4-Pro',
    category: 'chat', description: 'MIT open, 1M ctx: Non-think / Think High / Think Max modes.',
    isCurated: true, updatedAt: NOW, sourceCount: 16,
  },
  {
    id: 'qwen', name: 'Qwen', provider: 'alibaba', modelVersion: 'Qwen3.8-Max',
    category: 'open', description: 'Flagship 2.4T MoE, 1M ctx, thinking on; Qwen 4 announced Sept 2026.',
    isCurated: true, updatedAt: NOW, sourceCount: 14,
  },
  {
    id: 'hermes', name: 'Hermes Agent', provider: 'nous', modelVersion: 'Hermes 4 + Agent v0.21',
    category: 'agent', description: 'Hybrid reasoner with <think> toggle; Agent: memory, MCP, subagents.',
    isCurated: true, updatedAt: NOW, sourceCount: 12,
  },
  {
    id: 'opencode', name: 'OpenCode', provider: 'opencode', modelVersion: 'v1.18.x',
    category: 'code', description: 'AGENTS.md-driven: build/plan agents, --variant effort, verify loop.',
    isCurated: true, updatedAt: NOW, sourceCount: 12,
  },
  {
    id: 'mistral', name: 'Mistral', provider: 'mistral', modelVersion: 'Medium 3.5',
    category: 'open', description: '128B open coding flagship; [INST] concise, EU-multilingual.',
    isCurated: true, updatedAt: NOW, sourceCount: 11,
  },
  {
    id: 'suno-style', name: 'Suno · Style', provider: 'suno', modelVersion: 'Suno V5.5',
    category: 'music', description: '5-part formula, 8–15 tags, BPM ranges, Exclude Styles field.',
    isCurated: true, updatedAt: NOW, sourceCount: 18,
  },
  {
    id: 'suno-lyrics', name: 'Suno · Lyrics', provider: 'suno', modelVersion: 'Suno V5.5',
    category: 'music', description: 'POV + chorus job + syllable density 8–11 + [End], repeat chorus.',
    isCurated: true, updatedAt: NOW, sourceCount: 18,
  },
  {
    id: 'chatgpt-image', name: 'ChatGPT Image (GPT Image 2)', provider: 'openai', modelVersion: 'gpt-image-2',
    category: 'image', description: 'DALL·E retired: 32K-char prompts, quality/size/format, multi-turn edits.',
    isCurated: true, updatedAt: NOW, sourceCount: 15,
  },
];

export const CURATED_KNOWLEDGE: Record<string, LLMKnowledge> = {
  chatgpt: {
    profileId: 'chatgpt', version: 2,
    systemPromptStyle: 'Instructions-first + persona: exact specs (context, outcome, length, format, style); separate blocks with ### or """; be specific, never fluffy.',
    preferredStructure: { sections: ['Instructions', 'Context', 'Task', 'Steps', 'Constraints', 'Output format'] },
    tokenBudgetGuidance: 'Detailed but tight: numbered steps, concrete numbers ("3–5 sentences", not "fairly short"); for hard reasoning ask for higher reasoning effort instead of longer prose.',
    specialTokens: ['###', '"""'],
    fewShotExamples: [{ input: 'Summarize a text', output: 'Instructions: senior editor voice.\n"""\n{text}\n"""\nSteps: 1) one-sentence thesis 2) 3 key points 3) conclusion ≤80 words.\nFormat: markdown with ## Result / ## Details.' }],
    antiPatterns: ['Vague openers ("do your best")', 'Fluffy lengths ("fairly short")', 'Multiple questions in one prompt', 'Missing output format', 'Prompting a reasoning model like a plain GPT (no effort control)'],
    sourceUrls: ['https://developers.openai.com/api/docs/guides/prompt-engineering', 'https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering', 'https://openai.com/index/gpt-5-6', 'https://openai.com/research/index/release'],
    notes: 'GPT-6 Astra flagship (Sept 2026); GPT-6 Sol/Luna + GPT-5.6 tiers. Newest models need less prompt engineering — clarity beats cleverness.',
  },
  claude: {
    profileId: 'claude', version: 2,
    systemPromptStyle: 'XML-structured (<instructions>, <context>, <input>, <examples>) + light role in system prompt + adaptive thinking via effort; say what TO do, never what NOT to do.',
    preferredStructure: { sections: ['Role', 'Instructions', 'Context', 'Examples', 'Constraints', 'Output format'] },
    tokenBudgetGuidance: 'Rich reasoning by effort (low/medium/high/max): "think thoroughly" beats hand-written step plans; 3–5 <example>-wrapped multishot examples; respond directly, no preamble.',
    specialTokens: ['<instructions>', '<context>', '<input>', '<examples>', '<example>', '<thinking>'],
    fewShotExamples: [{ input: 'Classify feedback', output: '<thinking>Scanning tone and keywords…</thinking>\nCategory: bug — Priority: high' }],
    antiPatterns: ['Assistant prefill (400 error on new models)', 'budget_tokens (deprecated; use effort)', 'Over-specific roles that constrain helpfulness', 'Negative-only instructions ("do not use markdown")', 'Stacking every technique at once'],
    sourceUrls: ['https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices', 'http://claude.com/blog/best-practices-for-prompt-engineering'],
    notes: 'Opus 5.5 (Sept 22 2026, safest, always-on adaptive thinking); Fable 5.1 top tier; Sonnet 5 default. Thinking effort > manual CoT.',
  },
  gemini: {
    profileId: 'gemini', version: 2,
    systemPromptStyle: 'System Instruction carries persona + format + rules; ALWAYS include few-shot examples (Google: prompts without them are likely less effective); long context FIRST, task/question LAST with an anchor phrase.',
    preferredStructure: { sections: ['System instruction', 'Context', 'Few-shot examples', 'Task'] },
    tokenBudgetGuidance: 'Direct and well-structured; consistent example formatting (XML tags, whitespace, splitters); add a current-date clause for time-sensitive queries ("today is 27 Sept 2026").',
    specialTokens: [],
    fewShotExamples: [{ input: 'Classify wine', output: 'System: answer with exactly one word.\nExample — Input: ruby, tannic → Output: red\nTask (based on the information above): …' }],
    antiPatterns: ['Zero-shot when format matters', 'Instructions buried mid-context', 'Inconsistent example formatting', 'Missing current-date grounding on fresh topics', 'Too many examples (overfitting)'],
    sourceUrls: ['https://ai.google.dev/gemini-api/docs/prompting-strategies', 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/thinking/prompting-guide'],
    notes: '3.8 Flash (Sept 2026) workhorse; 3.1 Pro Preview flagship multimodal; Gemini 4 in post-training. Thinking models: start general, then add explicit steps only if needed.',
  },
  grok: {
    profileId: 'grok', version: 2,
    systemPromptStyle: 'Direct goal + tone + effort level; Grok 4.7 self-checks on hard tasks, so demand verification explicitly.',
    preferredStructure: { sections: ['Goal', 'Context', 'Reasoning effort', 'Verification', 'Output'] },
    tokenBudgetGuidance: 'Concise; set effort (low/medium/high/xhigh) to match difficulty; 500K context available for long tasks.',
    specialTokens: [],
    fewShotExamples: [{ input: 'Explain a trend', output: 'Goal: explain like to a smart friend. Effort: medium. Verify: cross-check the 2 key claims. Tone: sharp, zero fluff.' }],
    antiPatterns: ['Rigid cages on creative tasks', 'No verification request on factual/code tasks', 'Ignoring effort setting on hard problems'],
    sourceUrls: ['https://x.ai/news/grok-4-7'],
    notes: 'Grok 4.7 (Sept 21 2026, SpaceXAI): best for coding + knowledge work, CursorBench price-performance frontier.',
  },
  meta: {
    profileId: 'meta', version: 2,
    systemPromptStyle: 'Alpaca-style instruction tuning: ### Instruction / ### Input / ### Response; crisp instruction up top, one short example.',
    preferredStructure: { sections: ['Instruction', 'Input', 'Response'] },
    tokenBudgetGuidance: 'Medium: clear instruction first; use the 1M context for docs/code, not prose.',
    specialTokens: ['<s>', '</s>', '### Instruction:', '### Input:', '### Response:'],
    fewShotExamples: [{ input: 'Translate', output: '### Instruction: Translate to Italian, keep standard tech terms in English.\n### Input: …\n### Response: …' }],
    antiPatterns: ['Wordy system prompts', 'Non-standard formats without an example', 'Wasting 1M context on chat history instead of source material'],
    sourceUrls: ['https://www.llama.com/docs/how-to-guides/prompting/'],
    notes: 'Llama 4 Maverick (MoE 400B total / 17B active, 1M ctx, open weights). Scout for single-GPU efficiency.',
  },
  copilot: {
    profileId: 'copilot', version: 2,
    systemPromptStyle: 'Agent-mode brief: goal + repo context + chosen model tier + acceptance criteria + test/verify command; comment-first for inline completions.',
    preferredStructure: { sections: ['Goal', 'Repo context', 'Constraints', 'Acceptance criteria', 'Verify'] },
    tokenBudgetGuidance: 'Compact: point at files, never paste the repo; state the verify command (tests, build, lint).',
    specialTokens: ['///', '#', '//'],
    fewShotExamples: [{ input: 'Add debounce util', output: '// GOAL: debounce(fn, ms) — delay until ms of quiet\n// ACCEPT: typed, tested, exported from utils/\n// VERIFY: npm test utils/debounce\nexport function debounce…' }],
    antiPatterns: ['Goal without acceptance criteria', 'No verify step', 'Pasting whole files instead of paths', 'Ambiguity about which files may change'],
    sourceUrls: ['https://docs.github.com/en/copilot/reference/ai-models/supported-models', 'https://github.blog/changelog/2026-09-03-gemini-3-8-flash-is-now-available-in-github-copilot/'],
    notes: 'Multi-model picker (Sept 2026): GPT-6 family, Claude Sonnet 5/Opus 5/Fable 5.1, Gemini 3.8 Flash, Kimi K3. Pick per task; agent mode for multi-file work.',
  },
  perplexity: {
    profileId: 'perplexity', version: 2,
    systemPromptStyle: 'Agent-API brief: task intensity preset (fast/low/medium/high/xhigh) + source perimeter + recency window + typed output shape; demand numbered citations.',
    preferredStructure: { sections: ['Research question', 'Intensity preset', 'Source perimeter', 'Time window', 'Output shape'] },
    tokenBudgetGuidance: 'Medium: precise question + "cite every claim [n]" + explicit date window (e.g. Sept 2026).',
    specialTokens: [],
    fewShotExamples: [{ input: 'Compare two frameworks', output: 'Question: X vs Y on DX + perf (2025–2026). Intensity: high. Sources: official docs + benchmarks only. Output: comparison table + verdict, every claim cited [1][2].' }],
    antiPatterns: ['Using retired Sonar Chat Completions (support ended 27/09/2026)', 'Generic questions without perimeter', 'No citation demand', 'No time window on fast-moving topics'],
    sourceUrls: ['https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview', 'https://docs.perplexity.ai/docs/sonar/models/sonar'],
    notes: 'Sonar retired Sept 27 2026 → Agent API (unified, Search as Code). In-house Sonar (Llama 3.3 70B-based) powers default search.',
  },
  deepseek: {
    profileId: 'deepseek', version: 2,
    systemPromptStyle: 'Mode-first: declare Non-think (fast) / Think High (deliberate) / Think Max (extended); then Plan → Execute → Final answer with verification.',
    preferredStructure: { sections: ['Mode', 'Objective', 'Plan', 'Execution', 'Final answer'] },
    tokenBudgetGuidance: 'Long, traced reasoning on hard tasks; terse mode for simple ones; 1M context, 384K max output available.',
    specialTokens: [],
    fewShotExamples: [{ input: 'Debug algorithm', output: 'Mode: Think High.\nPlan: 1) hypotheses 2) mental tests 3) fix.\nExecution: …\nFinal answer: patch + why it works + how to verify.' }],
    antiPatterns: ['Final-answer-only on complex problems', 'No verification criterion', 'Using retired deepseek-chat/reasoner aliases'],
    sourceUrls: ['https://api-docs.deepseek.com/', 'https://www.deepseek.com/en/news/v4-preview/'],
    notes: 'V4.1-Flash (Sept 10 2026, current, image input) + V4-Pro-0813 GA; MIT open weights; extremely cheap tokens.',
  },
  qwen: {
    profileId: 'qwen', version: 2,
    systemPromptStyle: 'ChatML with explicit language + thinking on by default; declare response language to avoid ZH/EN/IT mixing.',
    preferredStructure: { sections: ['System', 'Task', 'Constraints', 'Output format'] },
    tokenBudgetGuidance: 'Medium-structured; 1M context on Max/Flash; thinking mode enabled by default — ask to show key steps only.',
    specialTokens: ['<|im_start|>system', '<|im_start|>user', '<|im_start|>assistant', '<|im_end|>'],
    fewShotExamples: [{ input: 'Bilingual summary', output: '<|im_start|>system\nAnswer in Italian; keep standard tech terms in English. Show 3 reasoning bullets, then the answer.<|im_end|>' }],
    antiPatterns: ['Ambiguous response language', 'No system/user separation', 'Asking to disable thinking on hard tasks'],
    sourceUrls: ['https://qwen.ai/home', 'https://docs.qwencloud.com/changelog/models'],
    notes: 'Qwen3.8-Max (Aug 2026, 2.4T MoE flagship, Apache 2.0 open); Qwen 4 (4 tiers) announced Sept 22 2026, specs pending.',
  },
  hermes: {
    profileId: 'hermes', version: 2,
    systemPromptStyle: 'Hermes 4 hybrid: character card + scenario + explicit <think> toggle (include it for hard problems, omit for speed); Agent v0.21: memory, MCP command center, subagents, cron.',
    preferredStructure: { sections: ['Persona card', 'Scenario', 'Thinking mode', 'Objective', 'Constraints'] },
    tokenBudgetGuidance: 'Evocative but tight card; steerable, non-preachy tone; use OpenRouter/Nous Portal model ids when routing.',
    specialTokens: ['<|im_start|>', '<|im_end|>', '<think>', '</think>'],
    fewShotExamples: [{ input: 'Historical dialogue', output: 'Persona: Venetian archivist, 1580. Thinking: on (<think>). Scenario: … Style: terse dialogue, no anachronisms.' }],
    antiPatterns: ['Persona without constraints', 'Vague scenario', 'Forcing <think> on trivial replies'],
    sourceUrls: ['https://hermes4.nousresearch.com/', 'https://hermes-agent.nousresearch.com/docs/reference/model-catalog'],
    notes: 'Hermes 4 (14B/70B/405B hybrid reasoners, 50x more data tokens, Atropos-synthesized); Agent v0.21 Pantheon (Aug 31 2026).',
  },
  opencode: {
    profileId: 'opencode', version: 2,
    systemPromptStyle: 'AGENTS.md-native: Goal → Agent (build/plan) → Model → Variant effort → Steps → Verify; commit AGENTS.md so the agent learns repo conventions.',
    preferredStructure: { sections: ['Goal', 'Agent', 'Steps', 'Verify', 'Done criteria'] },
    tokenBudgetGuidance: 'Operational: exact commands (opencode run, --continue, --format json); --variant high/max for hard refactors, minimal for edits.',
    specialTokens: [],
    fewShotExamples: [{ input: 'Refactor module', output: 'Goal: …. Agent: build. Steps: 1) grep 2) edit 3) test. Verify: `npm test` green. Done: minimal diff + green verify.' }],
    antiPatterns: ['Goal without done criteria', 'Steps without verify', 'Ambiguity about touchable files', 'Missing AGENTS.md conventions'],
    sourceUrls: ['https://opencode.ai/docs'],
    notes: 'v1.18.x (75+ providers via Models.dev, LSP, multi-session, Zen validated models, free built-in models).',
  },
  mistral: {
    profileId: 'mistral', version: 2,
    systemPromptStyle: 'Concise [INST] + declared language; Medium 3.5 for long-horizon coding, Large for frontier reasoning, Codestral for FIM completion.',
    preferredStructure: { sections: ['Instruction', 'Context', 'Output format'] },
    tokenBudgetGuidance: 'Terse and multilingual (FR/EN/IT/ES/DE native); pick tier per task to control cost.',
    specialTokens: ['[INST]', '[/INST]', '<s>', '</s>'],
    fewShotExamples: [{ input: 'Summary', output: '[INST] Summarize in 5 Italian bullets, tech terms in English. [/INST]\nText: …' }],
    antiPatterns: ['Verbose prompts', 'Undeclared language on multilingual tasks', 'Using Large where Medium 3.5 suffices'],
    sourceUrls: ['https://docs.mistral.ai/', 'https://mistral.ai/news/vibe-remote-agents-mistral-medium-3-5/'],
    notes: 'Medium 3.5 (128B open-weight coding flagship, May 2026); Large flagship proprietary; Small 4 / Ministral for cheap tiers.',
  },
  'suno-style': {
    profileId: 'suno-style', version: 2,
    systemPromptStyle: '5-part formula in order: (1) genre + subgenre, (2) mood + energy, (3) vocal style + character, (4) instruments + production, (5) tempo/BPM. 8–15 tags total, first tag weighs most; v5.5 allows 1000 chars.',
    preferredStructure: { sections: ['Genre', 'Mood + energy', 'Vocals', 'Instruments + production', 'Tempo'] },
    tokenBudgetGuidance: 'Compact (<1000 chars): concrete sonic references over vague adjectives; put negations in Exclude Styles field, not the Style box; BPM bands: ballads 60–80, pop 90–120, dance 120–150, EDM 140–180.',
    specialTokens: ['[intro]', '[verse]', '[chorus]', '[pre-chorus]', '[bridge]', '[outro]', '[instrumental]', '[hook]', '[end]'],
    fewShotExamples: [{ input: 'Melancholic ballad', output: 'indie folk, melancholic and intimate, soft breathy female vocals, fingerpicked acoustic guitar, upright bass, brushed drums, lo-fi tape warmth, 72 BPM' }],
    antiPatterns: ['Real artist names (blocked)', 'Three equal genres stacked (drift)', 'Negations inside Style box (unreliable — use Exclude Styles)', 'Filling all 1000 chars with keywords'],
    sourceUrls: ['https://about.suno.com/release-notes', 'https://sunnoai.com/prompt'],
    notes: 'V5.5 (Mar 2026): Voices, Custom Models, My Taste; ~40% better prompt accuracy (user-reported). One genre in charge; second style needs a clear job.',
  },
  'suno-lyrics': {
    profileId: 'suno-lyrics', version: 2,
    systemPromptStyle: 'Lyric-persona brief: theme + POV + chorus job + emotional movement; syllable density 8–11/bar for pop; repeat chorus word-for-word; end with [End]; keep effective lyrics ≤3000 chars.',
    preferredStructure: { sections: ['Theme + POV', 'Chorus job', 'Structure tags', 'Syllable budget', 'Lyrics with metatags'] },
    tokenBudgetGuidance: 'Singable: short lines (5–10 words EN), one idea per chorus, concrete scenes over abstractions; stacked tags for sections ([Chorus | Anthemic | Full Band]).',
    specialTokens: ['[Verse 1]', '[Pre-Chorus]', '[Chorus]', '[Verse 2]', '[Bridge]', '[Outro]', '[End]', '[Instrumental]'],
    fewShotExamples: [{ input: 'Winter sea', output: 'Theme: winter-sea melancholy, first-person remembering. Chorus job: one repeatable promise line. [Verse 1] … [Chorus] … [End]' }],
    antiPatterns: ['Lyrics before POV is set', 'Chorus carrying three ideas', 'Parentheses for directions (Suno sings them — use [brackets])', 'Verses too long to sing (>3000 chars rushing)'],
    sourceUrls: ['https://about.suno.com/release-notes', 'https://sunnoai.com/prompt'],
    notes: 'Custom Mode mandatory (separate Style/Lyrics/Title). Metatags are guidance: honored unless they fight the style.',
  },
  'chatgpt-image': {
    profileId: 'chatgpt-image', version: 2,
    systemPromptStyle: 'GPT Image 2 native prompt: dense natural-language visual description (subject → environment → style → light → composition → palette → mood) + explicit render params (quality/size/format); state text-in-image verbatim if needed; supports multi-turn edits.',
    preferredStructure: { sections: ['Subject', 'Environment', 'Art style', 'Lighting', 'Composition', 'Palette + mood', 'Render params'] },
    tokenBudgetGuidance: 'Rich but coherent (32K-char limit, 2–5 dense sentences); gpt-image-2 handles typography and precise edits far better than DALL·E 3 — specify exact wording for any text.',
    specialTokens: [],
    fewShotExamples: [{ input: 'Cyberpunk cat', output: 'A cyberpunk cat on a neon-lit windowsill, rain-soaked fur reflecting magenta and cyan, blade-runner mood, volumetric light, low angle, cinematic composition, neon-noir palette, hyperdetailed. Render: high quality, 1536x1024, png.' }],
    antiPatterns: ['DALL·E-era keyword soup without syntax', 'Too many subjects in one scene', 'Contradictory light/style directions', 'Assuming auto-rewrite (gpt-image follows prompts literally)'],
    sourceUrls: ['https://developers.openai.com/api/docs/guides/image-generation', 'https://developers.openai.com/api/reference/resources/images/methods/generate'],
    notes: 'gpt-image-2 (Apr 2026, ChatGPT Images 2.0); DALL·E snapshots retired; older GPT Image models deprecated Dec 1 2026. Params: quality, size (incl. arbitrary WxH), format, background, moderation low/auto, stream.',
  },
};
