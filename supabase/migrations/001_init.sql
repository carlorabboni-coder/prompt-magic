-- ── Prompt Magic · migration 001: schema iniziale ─────────────────────────
-- Esegui in Supabase SQL Editor o via supabase db push.

create extension if not exists "pgcrypto";

-- Profili LLM (curati + custom pubblici futuri)
create table if not exists public.llm_profiles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  provider text not null,
  model_version text,
  category text not null default 'chat',
  description text default '',
  is_curated boolean default true,
  created_by uuid references auth.users(id),
  source_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Knowledge versionata per profilo
create table if not exists public.llm_knowledge (
  id uuid primary key default gen_random_uuid(),
  llm_profile_id uuid references public.llm_profiles(id) on delete cascade,
  version int not null,
  system_prompt_style text default '',
  preferred_structure jsonb default '{"sections":[]}',
  token_budget_guidance text default '',
  special_tokens text[] default '{}',
  few_shot_examples jsonb default '[]',
  anti_patterns text[] default '{}',
  source_urls text[] default '{}',
  notes text default '',
  research_run_id uuid,
  is_active boolean default true,
  created_at timestamptz default now(),
  unique (llm_profile_id, version)
);

-- Log delle research run bi-settimanali
create table if not exists public.research_runs (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz default now(),
  completed_at timestamptz,
  status text check (status in ('running','completed','failed','partial')) default 'running',
  llm_profiles_updated uuid[] default '{}',
  sources_scraped int default 0,
  errors jsonb default '[]',
  triggered_by text check (triggered_by in ('schedule','manual','webhook')) default 'schedule'
);

alter table public.llm_knowledge
  add constraint fk_research_run foreign key (research_run_id)
  references public.research_runs(id) on delete set null not valid;

-- Profili custom utente
create table if not exists public.user_llm_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  provider text default 'custom',
  model_version text default 'custom-1.0',
  category text default 'chat',
  description text default '',
  system_prompt_style text default '',
  preferred_structure jsonb default '{"sections":[]}',
  token_budget_guidance text default '',
  special_tokens text[] default '{}',
  few_shot_examples jsonb default '[]',
  anti_patterns text[] default '{}',
  source_urls text[] default '{}',
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Cronologia generazioni (anonime ammesse)
create table if not exists public.prompt_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  original_prompt text not null,
  selected_llm_ids uuid[] default '{}',
  generated_prompts jsonb default '{}',
  created_at timestamptz default now()
);

-- RLS
alter table public.llm_profiles enable row level security;
alter table public.llm_knowledge enable row level security;
alter table public.research_runs enable row level security;
alter table public.user_llm_profiles enable row level security;
alter table public.prompt_generations enable row level security;

drop policy if exists "curated read all" on public.llm_profiles;
create policy "curated read all" on public.llm_profiles for select using (true);

drop policy if exists "knowledge read all" on public.llm_knowledge;
create policy "knowledge read all" on public.llm_knowledge for select using (true);

drop policy if exists "runs read all" on public.research_runs;
create policy "runs read all" on public.research_runs for select using (true);

drop policy if exists "own profiles all" on public.user_llm_profiles;
create policy "own profiles all" on public.user_llm_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "public custom read" on public.user_llm_profiles;
create policy "public custom read" on public.user_llm_profiles
  for select using (is_public = true);

drop policy if exists "own generations" on public.prompt_generations;
create policy "own generations" on public.prompt_generations
  for all using (auth.uid() = user_id or user_id is null)
  with check (auth.uid() = user_id or user_id is null);

-- Seed: 15 profili curati (slug stabili = id usati nel frontend)
insert into public.llm_profiles (slug, name, provider, model_version, category, description, is_curated, source_count)
values
  ('chatgpt','ChatGPT','openai','GPT-4o','chat','Istruzioni dirette, persona esplicita, formato output rigido.',true,24),
  ('claude','Claude','anthropic','Claude 3.5 Sonnet','chat','Tag XML, ragionamento passo-passo, contesto lungo.',true,22),
  ('gemini','Gemini','google','Gemini 1.5 Pro','chat','Strutturato, system instruction separate, multimodale.',true,18),
  ('grok','Grok','xai','Grok-2','chat','Diretto e minimalista, lascia spazio alla personalità.',true,11),
  ('meta','Meta AI (Llama)','meta','Llama 3.1 70B','open','Formato ### Instruction / ### Response.',true,15),
  ('copilot','Copilot','microsoft','Copilot (GPT-4o)','code','Commenti + firme, type hint, esempi inline.',true,13),
  ('perplexity','Perplexity','perplexity','Sonar Large','search','Query + citazioni + sintesi.',true,12),
  ('deepseek','DeepSeek','deepseek','DeepSeek-V3 / R1','chat','Reasoning trace esplicita.',true,14),
  ('qwen','Qwen','alibaba','Qwen 2.5 / 3','open','ChatML bilingue ZH/EN/IT.',true,12),
  ('hermes','Hermes Agent','nous','Hermes 3 (Llama 3.1)','agent','Character card + scenario.',true,9),
  ('opencode','OpenCode','opencode','Agent CLI','code','Goal → tools → steps → verify.',true,10),
  ('mistral','Mistral','mistral','Mistral Large 2','open','[INST] conciso, EU-multilingua.',true,10),
  ('suno-style','Suno · Style','suno','Suno v4','music','Tag genere + mood + BPM + sezioni.',true,16),
  ('suno-lyrics','Suno · Lyrics','suno','Suno v4','music','Topic + rima + struttura canzone.',true,16),
  ('chatgpt-image','ChatGPT Image (DALL·E 3)','openai','DALL·E 3','image','Soggetto → stile → luce → composizione.',true,17)
on conflict (slug) do update set
  name = excluded.name, provider = excluded.provider,
  model_version = excluded.model_version, category = excluded.category,
  description = excluded.description, source_count = excluded.source_count,
  updated_at = now();
