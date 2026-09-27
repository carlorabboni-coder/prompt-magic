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

// Solo doc ufficiali / gratuite, niente paywall.
const OFFICIAL_DOCS = {
  chatgpt: ['https://platform.openai.com/docs/guides/prompt-engineering'],
  claude: ['https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview'],
  gemini: ['https://ai.google.dev/gemini-api/docs/prompting-strategies'],
  grok: ['https://docs.x.ai/docs/guides/chat'],
  meta: ['https://www.llama.com/docs/how-to-guides/prompting/'],
  copilot: ['https://docs.github.com/en/copilot/using-github-copilot/prompt-engineering-for-github-copilot'],
  perplexity: ['https://docs.perplexity.ai/getting-started/overview'],
  deepseek: ['https://api-docs.deepseek.com/guides/reasoning_model'],
  qwen: ['https://qwen.readthedocs.io/en/latest/'],
  hermes: ['https://github.com/NousResearch/Hermes-Function-Calling'],
  opencode: ['https://opencode.ai/docs/'],
  mistral: ['https://docs.mistral.ai/capabilities/completion/'],
  'suno-style': ['https://suno.com/'],
  'suno-lyrics': ['https://suno.com/'],
  'chatgpt-image': ['https://openai.com/index/dall-e-3/'],
};

const SEARCH_QUERIES = {
  chatgpt: ['openai prompt engineering best practices site:platform.openai.com', 'openai cookbook prompting github'],
  claude: ['anthropic prompt library xml tags', 'claude prompt engineering tutorial github'],
  gemini: ['gemini system instructions best practices'],
  grok: ['grok prompting guide'],
  meta: ['llama 3 instruction format prompting'],
  copilot: ['github copilot prompt engineering code'],
  perplexity: ['perplexity sonar prompting citations'],
  deepseek: ['deepseek r1 prompting reasoning'],
  qwen: ['qwen chatml prompting guide'],
  hermes: ['nous hermes prompting character card'],
  opencode: ['opencode agent prompting best practices'],
  mistral: ['mistral inst format prompting'],
  'suno-style': ['suno style prompt tags genre bpm metatags guide 2025 2026'],
  'suno-lyrics': ['suno lyrics structure verse chorus bridge songwriting guide'],
  'chatgpt-image': ['dall-e 3 prompt tips natural language guide'],
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
