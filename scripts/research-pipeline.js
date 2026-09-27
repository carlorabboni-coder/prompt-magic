// ── Prompt Magic · pipeline di ricerca bi-settimanale · 100% GRATIS ───────
// Tre modalità (sceglie da sola la migliore disponibile):
//   1. FREE (default, zero chiavi): fetch HTTP diretto delle doc ufficiali,
//      estrae titolo/meta e registra hash+lunghezza per rilevare cambiamenti.
//   2. LIVE Firecrawl (opzionale): se FIRECRAWL_API_KEY è presente, aggiunge
//      search+scrape approfonditi sopra il giro FREE.
//   3. --dry-run: pianifica soltanto, senza rete.
// Uso:
//   node scripts/research-pipeline.js              → modo FREE (gratis)
//   node scripts/research-pipeline.js --dry-run    → pianifica e basta
//   FIRECRAWL_API_KEY=… node scripts/research-pipeline.js → FREE + Firecrawl
// Report sempre in ./reports/research-YYYY-MM-DD.json (committato dalla Action).

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry-run');
const FIRECRAWL_KEY = process.env.FIRECRAWL_API_KEY;

// Official docs only (free, no paywall). Updated 27 Sept 2026.
const OFFICIAL_DOCS = {
  chatgpt: ['https://developers.openai.com/api/docs/guides/prompt-engineering'],
  claude: ['https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices'],
  gemini: ['https://ai.google.dev/gemini-api/docs/prompting-strategies'],
  grok: ['https://x.ai/news/grok-4-7'],
  meta: ['https://www.llama.com/docs/how-to-guides/prompting/'],
  copilot: ['https://docs.github.com/en/copilot/reference/ai-models/supported-models'],
  perplexity: ['https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview'],
  deepseek: ['https://api-docs.deepseek.com/'],
  qwen: ['https://qwen.ai/home'],
  hermes: ['https://hermes4.nousresearch.com/'],
  opencode: ['https://opencode.ai/docs'],
  mistral: ['https://docs.mistral.ai/'],
  'suno-style': ['https://about.suno.com/release-notes'],
  'suno-lyrics': ['https://about.suno.com/release-notes'],
  'chatgpt-image': ['https://developers.openai.com/api/docs/guides/image-generation'],
};

const SEARCH_QUERIES = {
  chatgpt: ['GPT-6 Astra prompting reasoning effort guide', 'openai prompt engineering guide developers'],
  claude: ['Claude Opus 5.5 adaptive thinking effort prompting', 'anthropic xml prompt best practices 2026'],
  gemini: ['Gemini 3.8 Flash prompting system instruction few-shot'],
  grok: ['Grok 4.7 reasoning effort coding guide'],
  meta: ['Llama 4 Maverick prompting instruction format'],
  copilot: ['GitHub Copilot multi-model agent mode best practices'],
  perplexity: ['Perplexity Agent API presets Search as Code migration'],
  deepseek: ['DeepSeek V4.1 Flash thinking modes prompting'],
  qwen: ['Qwen3.8 Max prompting ChatML thinking guide'],
  hermes: ['Hermes 4 hybrid think toggle prompting'],
  opencode: ['OpenCode AGENTS.md agent build plan best practices'],
  mistral: ['Mistral Medium 3.5 INST prompting coding'],
  'suno-style': ['Suno V5.5 style formula 5-part tags BPM 2026'],
  'suno-lyrics': ['Suno V5.5 lyrics structure tags syllable End 2026'],
  'chatgpt-image': ['gpt-image-2 prompt guide quality size multi-turn editing'],
};

async function fetchFree(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'PromptMagic-FreeResearch/1.0 (+biweekly docs check)' },
    });
    const text = await res.text();
    const title = (text.match(/<title[^>]*>([^<]{1,200})<\/title>/i) || [])[1]?.trim() ?? '';
    const desc = (text.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']{1,300})/i) || [])[1]?.trim() ?? '';
    return {
      url, http: res.status, ok: res.ok,
      title, description: desc,
      bytes: text.length,
      sha256: createHash('sha256').update(text).digest('hex').slice(0, 16),
    };
  } finally {
    clearTimeout(t);
  }
}

async function firecrawlSearch(query, limit = 5) {
  const res = await fetch('https://api.firecrawl.dev/v1/search', {
    method: 'POST',
    headers: { Authorization: `Bearer ${FIRECRAWL_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, limit }),
  });
  if (!res.ok) throw new Error(`firecrawl search ${res.status}`);
  return res.json();
}

async function main() {
  const started = new Date().toISOString();
  const mode = DRY ? 'dry-run' : FIRECRAWL_KEY ? 'free+firecrawl' : 'free';
  console.log(`[research] avvio ${started} · mode=${mode} · 100% gratis di base`);
  const report = { startedAt: started, mode, cost: '0 EUR — giro FREE senza API a pagamento', results: [] };

  for (const [slug, urls] of Object.entries(OFFICIAL_DOCS)) {
    if (DRY) {
      report.results.push({ slug, status: 'planned', urls, queries: SEARCH_QUERIES[slug] ?? [] });
      continue;
    }
    const entry = { slug, status: 'checked', urls, docs: [], firecrawl: [], queries: SEARCH_QUERIES[slug] ?? [] };
    for (const u of urls) {
      try {
        entry.docs.push(await fetchFree(u));
        await new Promise((r) => setTimeout(r, 500)); // gentile con i server
      } catch (e) {
        entry.docs.push({ url: u, ok: false, error: String(e).slice(0, 200) });
      }
    }
    if (FIRECRAWL_KEY) {
      try {
        for (const q of (SEARCH_QUERIES[slug] ?? []).slice(0, 2)) {
          const r = await firecrawlSearch(q, 5);
          for (const h of (r.data?.web ?? r.web ?? [])) entry.firecrawl.push({ title: h.title, url: h.url });
          await new Promise((r2) => setTimeout(r2, 800));
        }
      } catch (e) {
        entry.firecrawlError = String(e).slice(0, 200);
      }
    }
    const okDocs = entry.docs.filter((d) => d.ok).length;
    entry.status = okDocs > 0 ? 'checked' : 'failed';
    console.log(`[research] ${slug}: ${okDocs}/${urls.length} doc OK${FIRECRAWL_KEY ? ` + ${entry.firecrawl.length} firecrawl` : ''}`);
    report.results.push(entry);
  }

  const dir = join(ROOT, 'reports');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const out = join(dir, `research-${started.slice(0, 10)}.json`);
  writeFileSync(out, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`[research] report → ${out} · costo 0 EUR in modo FREE`);
}

main().catch((e) => { console.error(e); process.exit(1); });
