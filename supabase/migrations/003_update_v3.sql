-- ── Prompt Magic · migration 003: knowledge v3 (27 sett 2026, deep round) ──
-- Evidence: vendor docs + top AI YouTubers (Berman, AI Explained, Cole Medin,
-- Fireship, Karpathy, Matt Pocock…) + claude.com/blog Aug 2026 + Suno guides.

update public.llm_profiles set
  description = v.description, source_count = v.source_count, updated_at = now()
from (values
  ('chatgpt','Flagship Sept 2026: instructions first, success criteria, specific-over-polite.',29),
  ('claude','Effort-based reasoning, action verbs, anti-overengineering, I-don''t-know rule.',28),
  ('gemini','System Instruction + few-shot + success criteria + task-last anchor.',23),
  ('grok','Coding + knowledge work, 500K context, configurable reasoning effort.',14),
  ('meta','Open MoE 400B/17B active, 1M context, ### Instruction / ### Response.',16),
  ('copilot','Action-oriented briefs, anti-overengineering, verbosity control, verify.',18),
  ('perplexity','Agent API presets + uncertainty flags + numbered citations per claim.',16),
  ('deepseek','MIT open, 1M ctx: Non-think / Think High / Think Max modes.',17),
  ('qwen','Flagship 2.4T MoE, 1M ctx, thinking on; Qwen 4 announced Sept 2026.',15),
  ('hermes','Hybrid reasoner with <think> toggle; Agent: memory, MCP, subagents.',13),
  ('opencode','Skills-style briefs: explicit verbs, minimal diff, parallel-safe.',15),
  ('mistral','128B open coding flagship; [INST] concise, EU-multilingual.',12),
  ('suno-style','5-part formula, 8–15 tags, BPM ranges, Exclude Styles field.',20),
  ('suno-lyrics','Lyric persona + POV + chorus job + syllables 8–11 + [End].',20),
  ('chatgpt-image','Show-don''t-tell visuals: concrete scenes, exact text, render params.',16)
) as v(slug, description, source_count)
where public.llm_profiles.slug = v.slug;
