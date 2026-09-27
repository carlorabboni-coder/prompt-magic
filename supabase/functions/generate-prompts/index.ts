// ── Prompt Magic · Supabase Edge Function: generate-prompts (v2) ─────────
// Deploy: supabase functions deploy generate-prompts
// Body: { "prompt": string, "llmProfileIds": string[], "customKnowledge"?: Record<id, knowledge> }
// Output prompts are in ENGLISH (best model performance); user content preserved verbatim.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.0';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function estTokens(t: string): number {
  return Math.ceil(t.length / 4);
}

function compose(profile: { id: string; name: string }, k: any, user: string): string {
  const u = user.trim();
  const anti = (k.anti_patterns ?? []).slice(0, 3).join('; ');
  const shots = (k.few_shot_examples ?? []).filter((s: any) => s.input || s.output).slice(0, 1);
  const shotTxt = shots.length ? `\n\nStyle reference:\nInput: ${shots[0].input}\nOutput: ${shots[0].output}` : '';
  const tail = `\n\nGuidance: ${k.token_budget_guidance ?? ''}.${anti ? `\nAvoid: ${anti}.` : ''}${shotTxt}`;

  switch (profile.id) {
    case 'chatgpt':
      return `Act as a world-class expert.\n\n### Instructions\n1. State the goal in one sentence.\n2. Work through it with explicit reasoning.\n3. Deliver in markdown (## Result / ## Details / ## Next steps).\n\n### Context\n"""\n${u}\n"""${tail}`;
    case 'claude':
      return `<instructions>\nExpert, precise, honest assistant. Think thoroughly, then answer directly without preamble.\n</instructions>\n<context>\n${u}\n</context>\n<input>\nReason in <thinking>, answer in <answer> (markdown).\n</input>${tail}`;
    case 'gemini':
      return `[SYSTEM INSTRUCTION — Senior analyst: accurate, structured, never invent. Today is 27 September 2026.]\n\n[CONTEXT]\n${u}\n\n[TASK — based on the information above]\n1. Summary (max 5 lines) 2. Analysis 3. Risks 4. Recommendation${tail}`;
    case 'suno-style':
      return `${u.toLowerCase()}, [intro] [verse] [chorus] [verse] [chorus] [bridge] [chorus] [outro]\n\nSuno V5.5: 5-part order (genre → mood → vocals → instruments → BPM); 8–15 tags; no real artists; negations go in Exclude Styles.`;
    case 'suno-lyrics':
      return `Singable lyrics (match the topic's language).\nTheme + POV: ${u}\nStructure: [Verse 1] [Pre-Chorus] [Chorus] [Verse 2] [Chorus] [Bridge] [Chorus] [Outro] [End]\nOne repeatable hook; 8–11 syllables per line; repeat chorus word-for-word.`;
    case 'chatgpt-image':
      return `${u.replace(/\.$/, '')}, rich cinematic detail, coherent lighting, thoughtful composition, harmonious palette, sharp focus, atmospheric depth. Render: high quality, 1536x1024, png.`;
    default: {
      const secs: string[] = k.preferred_structure?.sections ?? ['Task'];
      return `${secs.map((s) => `${String(s).toUpperCase()}:\n${u}`).join('\n\n')}${tail}`;
    }
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const { prompt, llmProfileIds, customKnowledge } = await req.json();
    if (!prompt || !Array.isArray(llmProfileIds) || !llmProfileIds.length) {
      return new Response(JSON.stringify({ error: 'prompt and llmProfileIds[] are required' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    if (String(prompt).length > 8000) {
      return new Response(JSON.stringify({ error: 'prompt too long (max 8000 chars)' }), { status: 413, headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: profiles } = await supabase.from('llm_profiles').select('*').in('slug', llmProfileIds);
    const { data: know } = await supabase.from('llm_knowledge').select('*').eq('is_active', true);

    const kBySlug: Record<string, any> = {};
    for (const k of know ?? []) {
      const p = (profiles ?? []).find((x: any) => x.id === k.llm_profile_id);
      if (p) kBySlug[p.slug] = k;
    }

    const prompts = llmProfileIds.map((slug: string) => {
      const p = (profiles ?? []).find((x: any) => x.slug === slug);
      const name = p?.name ?? (customKnowledge?.[slug]?.profileName ?? slug);
      const k = kBySlug[slug] ?? customKnowledge?.[slug] ?? {
        preferred_structure: { sections: ['Role', 'Context', 'Task', 'Constraints', 'Output format'] },
        token_budget_guidance: 'Medium', anti_patterns: [], few_shot_examples: [],
      };
      const text = compose({ id: slug, name }, k, String(prompt));
      return { profileId: slug, profileName: name, prompt: text, charCount: text.length, estTokens: estTokens(text) };
    });

    await supabase.from('prompt_generations').insert({
      original_prompt: String(prompt).slice(0, 4000),
      selected_llm_ids: [],
      generated_prompts: { count: prompts.length },
    });

    return new Response(JSON.stringify({ prompts }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});
