-- ── Prompt Magic · migration 002: knowledge v2 (27 sett 2026) ─────────────
-- Aggiorna i profili curati alle versioni reali di settembre 2026.

update public.llm_profiles set
  name = v.name, provider = v.provider, model_version = v.model_version,
  category = v.category, description = v.description,
  source_count = v.source_count, updated_at = now()
from (values
  ('chatgpt','ChatGPT','openai','GPT-6 Astra','chat','Flagship Sept 2026: instructions first, ###/""" separators, reasoning effort.',26),
  ('claude','Claude','anthropic','Opus 5.5','chat','Adaptive thinking by effort, XML tags, positive instructions, 3–5 examples.',24),
  ('gemini','Gemini','google','3.8 Flash','chat','System Instruction first, always few-shot, context-first + task-last.',21),
  ('grok','Grok','spacexai','Grok 4.7','chat','Coding + knowledge work, 500K context, configurable reasoning effort.',13),
  ('meta','Meta AI (Llama)','meta','Llama 4 Maverick','open','Open MoE 400B/17B active, 1M context, ### Instruction / ### Response.',15),
  ('copilot','Copilot','microsoft','Multi-model (GPT-6 · Claude · Gemini)','code','Model picker + agent mode: goal, repo context, accept criteria, tests.',15),
  ('perplexity','Perplexity','perplexity','Agent API','search','Sonar retired 27/09/2026: Agent API presets, Search as Code, citations.',14),
  ('deepseek','DeepSeek','deepseek','V4.1-Flash + V4-Pro','chat','MIT open, 1M ctx: Non-think / Think High / Think Max modes.',16),
  ('qwen','Qwen','alibaba','Qwen3.8-Max','open','Flagship 2.4T MoE, 1M ctx, thinking on; Qwen 4 announced Sept 2026.',14),
  ('hermes','Hermes Agent','nous','Hermes 4 + Agent v0.21','agent','Hybrid reasoner with <think> toggle; Agent: memory, MCP, subagents.',12),
  ('opencode','OpenCode','opencode','v1.18.x','code','AGENTS.md-driven: build/plan agents, --variant effort, verify loop.',12),
  ('mistral','Mistral','mistral','Medium 3.5','open','128B open coding flagship; [INST] concise, EU-multilingual.',11),
  ('suno-style','Suno · Style','suno','Suno V5.5','music','5-part formula, 8–15 tags, BPM ranges, Exclude Styles field.',18),
  ('suno-lyrics','Suno · Lyrics','suno','Suno V5.5','music','POV + chorus job + syllable density 8–11 + [End], repeat chorus.',18),
  ('chatgpt-image','ChatGPT Image (GPT Image 2)','openai','gpt-image-2','image','DALL·E retired: 32K-char prompts, quality/size/format, multi-turn edits.',15)
) as v(slug, name, provider, model_version, category, description, source_count)
where public.llm_profiles.slug = v.slug;
