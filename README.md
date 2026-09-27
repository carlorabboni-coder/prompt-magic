# ✦ Prompt Magic — 100% GRATIS

**Un prompt grezzo → versioni ottimizzate per ogni LLM.** Knowledge base versionata, auto-aggiornante ogni 14 giorni. **Costo totale: 0 €, per sempre.**

## 💰 Garanzia 100% gratis

| Componente | Scelta | Costo |
|---|---|---|
| Frontend | React + Vite + TypeScript | 0 € (open source MIT) |
| Font | Google Fonts (JetBrains Mono + Plex Sans) | 0 € (OFL) |
| Database/cloud | **Opzionale** — l'app funziona senza | 0 € in locale; Supabase free tier se lo attivi |
| Hosting | Qualsiasi statico (Vercel/Netlify/Cloudflare/GitHub Pages free) | 0 € |
| Ricerca auto | **Modo FREE**: fetch diretto doc ufficiali, zero API key | 0 € |
| Ricerca extra | Firecrawl **solo opzionale** (migliora, non serve) | 0 € senza |
| Analytics/tracking | Nessuno incluso | 0 € |
| **TOTALE** | | **0 €** |

> Non serve carta di credito, non serve account, non serve API key per usare l'app.

## Funzionalità (v1.0)

- **15 profili curati**: ChatGPT, Claude, Gemini, Grok, Meta Llama, Copilot, Perplexity, DeepSeek, Qwen, Hermes Agent, OpenCode, Mistral, **Suno Style**, **Suno Lyrics**, **ChatGPT Image (DALL·E 3)**
- **Generatore multi-LLM**: textarea → multi-select → prompt ottimizzati per ciascuno (struttura, stile, vincoli, esempi, anti-pattern)
- **Badge freschezza**: aggiornato/da aggiornare + giorni + n. fonti per modello
- **Template rapidi**: code review, articolo SEO, analisi dati, ricerca verificata, canzone Suno, immagine cyberpunk, debug, traduzione
- **Profili custom**: wizard 7 step (identità → stile → struttura → esempi → anti-pattern → fonti → visibilità), salvati in locale (+ Supabase se configurato)
- **Cronologia**: 100 record, ripristino, export MD/JSON, link condivisibili `?prompt=&llms=` e `?h=id`
- **Export Prompt Pack**: unico .md con originale + tutte le versioni + note
- **Shortcut**: `⌘/Ctrl+Invio` genera · `⌘K` cerca modelli · `1-9` toggle
- **PWA-ready**: manifest + theme dark terminal

## 🚀 Pubblicazione gratis su GitHub Pages (1 volta sola)

Il workflow `.github/workflows/deploy.yml` è già pronto. Ti bastano 3 comandi
(serve solo un account GitHub gratuito, niente carta):

```bash
git init -b main
git add -A
git commit -m "Prompt Magic v1.0"
# crea un repo vuoto su github.com/new (gratis), poi:
git remote add origin https://github.com/TUO-UTENTE/prompt-magic.git
git push -u origin main
```

Poi su GitHub: **Settings → Pages → Source: GitHub Actions** (una volta sola).
Da lì in poi, a ogni `git push` l'app si pubblica da sola, gratis, e la ricerca
bi-settimanale gira da sola. URL tipo: `https://TUO-UTENTE.github.io/prompt-magic/`.

## Quickstart locale (zero setup)

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build produzione
npm run preview
```

L'app funziona **senza backend**: knowledge seed locale + localStorage per custom/cronologia.

## Cloud (opzionale, consigliato)

1. Crea progetto su [Supabase](https://supabase.com) → copia URL + anon key in `.env` (vedi `.env.example`)
2. Esegui `supabase/migrations/001_init.sql` nel SQL Editor
3. (Facoltativo) deploy Edge Function:
   ```bash
   supabase functions deploy generate-prompts
   ```
4. Deploy frontend su Vercel: root = questa cartella, `npm run build`, `dist` come output

## Ricerca automatica (ogni 14 giorni)

- Workflow: `.github/workflows/research.yml` — cron `0 3 */14 * *` + trigger manuale
- Script: `scripts/research-pipeline.js`
- Secrets richiesti: `FIRECRAWL_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
- Senza chiavi gira in **dry-run** e salva report in `reports/research-YYYY-MM-DD.json`
- Con chiavi: search+scrape reali per tutti i 15 profili (fase 2: sintesi → upsert `llm_knowledge` versionata)

```bash
# prova locale senza chiavi
node scripts/research-pipeline.js --dry-run
```

## Struttura

```
src/
  App.tsx                 # shell + tab + shortcut + deep-link
  types/                  # LLMProfile, LLMKnowledge, GeneratedPrompt…
  data/seedKnowledge.ts   # 15 profili + knowledge v1 (il “seed migliore”)
  services/
    generation.ts         # composer per-modello (mirror Edge Function)
    storage.ts            # localStorage custom/cronologia
    supabase.ts           # client con fallback locale
  components/             # PromptInput, LLMSelector, Card, Badge, Wizard…
  styles/                 # tokens.css + globals.css (Terminal Precision)
supabase/
  migrations/001_init.sql
  functions/generate-prompts/index.ts
scripts/research-pipeline.js
.github/workflows/research.yml
```

## Design (Terminal Precision)

- Font: JetBrains Mono (display) + IBM Plex Sans (testo) · scala 1.25
- Colori: base `#0d0d0d`, surface `#1a1a1a`, accento ambra `#d4a843`, successo `#6b9080`
- Raggio 0, ombre 0 — solo righe e spazio · focus sempre visibile · 5 stati per bottone

## Roadmap suggerita

- [ ] Supabase Realtime per badge “appena aggiornato”
- [ ] Community gallery profili pubblici + rating
- [ ] A/B test varianti + scoring qualità
- [ ] Stima costo token per modello
- [ ] Preview reale Suno/DALL·E con API key utente
- [ ] i18n EN + light mode
