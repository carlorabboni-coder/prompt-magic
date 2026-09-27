// ── Prompt Magic · Supabase Edge Function: generate-prompts ───────────────
// Deploy: supabase functions deploy generate-prompts
// Body: { "prompt": string, "llmProfileIds": string[], "customKnowledge"?: Record<id, knowledge> }
// Ritorna: { prompts: [{ profileId, profileName, prompt, charCount, estTokens }] }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.0';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function estTokens(t: string): number {
  return Math.ceil(t.length / 4);
}

// Composer server-side (mirror della logica frontend per coerenza)
function compose(profile: { id: string; name: string }, k: any, user: string): string {
  const u = user.trim();
  const anti = (k.anti_patterns ?? []).slice(0, 3).join('; ');
  const shots = (k.few_shot_examples ?? []).filter((s: any) => s.input || s.output).slice(0, 1);
  const shotTxt = shots.length ? `\n\nRiferimento:\nInput: ${shots[0].input}\nOutput: ${shots[0].output}` : '';
  const tail = `\n\nGuida: ${k.token_budget_guidance ?? ''}.${anti ? `\nEvita: ${anti}.` : ''}${shotTxt}`;

  switch (profile.id) {
    case 'chatgpt':
      return `Agisci come un esperto di livello mondiale.\n\nCONTESTO:\n${u}\n\nPASSI:\n1. Obiettivo in 1 frase.\n2. Svolgimento con ragionamento esplicito.\n3. Output in markdown (## Risultato / ## Dettagli / ## Prossimi passi).${tail}`;
    case 'claude':
      return `<ruolo>Assistente esperto, preciso e onesto.</ruolo>\n<contesto>${u}</contesto>\n<compito>Ragiona in <ragionamento>, poi rispondi in <risposta> (markdown).</compito>${tail}`;
    case 'suno-style':
      return `${u.toLowerCase()}, [intro] [verse] [chorus] [verse] [chorus] [bridge] [chorus] [outro]\n\nRegole: niente artisti reali; tag concreti; <200 caratteri.`;
    case 'suno-lyrics':
      return `Testo cantabile in italiano.\nTopic: ${u}\nStruttura: [Verse 1] [Chorus] [Verse 2] [Chorus] [Bridge] [Chorus] [Outro]\nRima ABAB / ritornello semplice e memorabile; versi ≤10 sillabe.`;
    case 'chatgpt-image':
      return `${u.replace(/\.$/, '')}, rich cinematic detail, coherent lighting, thoughtful composition, harmonious palette, sharp focus, atmospheric depth, no text or watermark.`;
    default: {
      const secs: string[] = k.preferred_structure?.sections ?? ['Compito'];
      return `${secs.map((s) => `${String(s).toUpperCase()}:\n${u}`).join('\n\n')}${tail}`;
    }
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const { prompt, llmProfileIds, customKnowledge } = await req.json();
    if (!prompt || !Array.isArray(llmProfileIds) || !llmProfileIds.length) {
      return new Response(JSON.stringify({ error: 'prompt e llmProfileIds[] obbligatori' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    if (String(prompt).length > 8000) {
      return new Response(JSON.stringify({ error: 'prompt troppo lungo (max 8000 ch)' }), { status: 413, headers: { ...cors, 'Content-Type': 'application/json' } });
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
        preferred_structure: { sections: ['Ruolo', 'Contesto', 'Compito', 'Vincoli', 'Formato output'] },
        token_budget_guidance: 'Medio', anti_patterns: [], few_shot_examples: [],
      };
      const text = compose({ id: slug, name }, k, String(prompt));
      return { profileId: slug, profileName: name, prompt: text, charCount: text.length, estTokens: estTokens(text) };
    });

    // log best-effort
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
