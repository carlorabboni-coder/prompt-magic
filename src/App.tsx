// ── Prompt Magic · App principale ─────────────────────────────────────────
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PromptInput from './components/PromptInput';
import LLMSelector from './components/LLMSelector';
import GeneratedPromptCard from './components/GeneratedPromptCard';
import TemplatesBar, { type QuickTemplate } from './components/TemplatesBar';
import ProfileBuilder from './components/ProfileBuilder';
import HistoryPanel from './components/HistoryPanel';
import type { GeneratedPrompt, GenerationRecord, LLMKnowledge, LLMProfile } from './types';
import { composeAll } from './services/generation';
import {
  allKnowledge, allProfiles, clearHistory as clearHistStore, deleteHistory as deleteHistStore,
  loadCustomKnowledge, loadHistory, pushHistory, saveCustomKnowledge, saveCustomProfiles,
} from './services/storage';
import { copyText, downloadFile, uid } from './utils/format';

type Tab = 'generate' | 'profiles' | 'history';

const DEFAULT_SELECTED = ['chatgpt', 'claude', 'suno-style', 'suno-lyrics', 'chatgpt-image'];

export default function App() {
  const [tab, setTab] = useState<Tab>('generate');
  const [profiles, setProfiles] = useState<LLMProfile[]>(() => allProfiles());
  const [knowledge, setKnowledge] = useState<Record<string, LLMKnowledge>>(() => allKnowledge());
  const [prompt, setPrompt] = useState('');
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED);
  const [results, setResults] = useState<GeneratedPrompt[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GenerationRecord[]>(() => loadHistory());
  const [query, setQuery] = useState('');
  const [building, setBuilding] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = useCallback((m: string) => {
    setToast(m);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  // Deep-link: ?prompt=…&llms=a,b + ripristino history ?h=id
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const qp = sp.get('prompt');
    const ql = sp.get('llms');
    const qh = sp.get('h');
    if (qp) setPrompt(qp);
    if (ql) {
      const ids = ql.split(',').map((s) => s.trim()).filter(Boolean);
      if (ids.length) setSelected(ids);
    }
    if (qh) {
      const found = loadHistory().find((h) => h.id === qh);
      if (found) {
        setPrompt(found.originalPrompt);
        setSelected(found.selectedIds);
        setResults(found.results);
        showToast('Generazione ripristinata dal link');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter((p) =>
      [p.name, p.provider, p.modelVersion, p.description].join(' ').toLowerCase().includes(q),
    );
  }, [profiles, query]);

  const selectedProfiles = useMemo(
    () => selected.map((id) => profiles.find((p) => p.id === id)).filter((p): p is LLMProfile => Boolean(p)),
    [selected, profiles],
  );

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function generate() {
    setError(null);
    if (!prompt.trim()) { setError('Scrivi prima il tuo prompt grezzo.'); return; }
    if (!selectedProfiles.length) { setError('Seleziona almeno un modello.'); return; }
    setGenerating(true);
    // Simula latenza edge (composizione locale istantanea, ma con feedback 1s per UX + quick wins)
    window.setTimeout(() => {
      try {
        const out = composeAll(selectedProfiles, knowledge, prompt);
        setResults(out);
        const rec: GenerationRecord = {
          id: uid('gen'), createdAt: new Date().toISOString(),
          originalPrompt: prompt, selectedIds: [...selected], results: out,
        };
        setHistory(pushHistory(rec));
        // aggiorna URL condivisibile senza reload
        const sp = new URLSearchParams();
        sp.set('prompt', prompt.slice(0, 500));
        sp.set('llms', selected.join(','));
        window.history.replaceState(null, '', `${location.pathname}?${sp.toString()}`);
        showToast(`Generati ${out.length} prompt ottimizzati`);
      } catch (e) {
        setError(`Generazione fallita: ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        setGenerating(false);
      }
    }, 450);
  }

  async function copyAll() {
    const text = results.map((r) => `════ ${r.profileName} ════\n${r.prompt}`).join('\n\n');
    const ok = await copyText(text);
    showToast(ok ? `Copiati ${results.length} prompt` : 'Copia fallita');
  }

  function exportPack() {
    const md = `# Prompt Magic · Prompt Pack\n_Data: ${new Date().toLocaleString('it-IT')}_\n\n## Prompt originale\n${prompt}\n\n${results.map((r) => `---\n\n## ${r.profileName} (~${r.estTokens} token)\n\n\`\`\`\n${r.prompt}\n\`\`\`\n`).join('\n')}\n## Note\n- Knowledge base versionata, ultimo aggiornamento badge per modello.\n- Rigenera dopo ogni research run bi-settimanale per best practice fresche.\n`;
    downloadFile(`prompt-pack-${Date.now()}.md`, md, 'text/markdown');
    showToast('Prompt Pack esportato (.md)');
  }

  function pickTemplate(t: QuickTemplate) {
    setPrompt(t.prompt);
    setSelected(t.llms.filter((id) => profiles.some((p) => p.id === id)));
    showToast(`Template: ${t.label}`);
  }

  function saveCustom(profile: LLMProfile, k: LLMKnowledge) {
    const customs = [...profiles.filter((p) => p.isCustom), profile];
    saveCustomProfiles(customs);
    const ck = { ...loadCustomKnowledge(), [k.profileId]: k };
    saveCustomKnowledge(ck);
    setProfiles(allProfiles());
    setKnowledge(allKnowledge());
    setSelected((s) => [...new Set([...s, profile.id])]);
    setBuilding(false);
    setTab('generate');
    showToast(`Profilo salvato: ${profile.name}`);
  }

  // Shortcut: Cmd/Ctrl+Enter genera · Cmd+K focus ricerca · 1-9 toggle
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'Enter') { e.preventDefault(); generate(); }
      if (mod && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        document.getElementById('llm-search')?.focus();
      }
      if (!mod && /^[1-9]$/.test(e.key) && tab === 'generate' && document.activeElement?.tagName !== 'TEXTAREA' && document.activeElement?.tagName !== 'INPUT') {
        const idx = Number(e.key) - 1;
        const list = filtered;
        if (list[idx]) toggle(list[idx].id);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand">PROMPT<span className="magic">✦</span>MAGIC</div>
          <p className="tagline">un prompt grezzo → versioni ottimizzate per ogni LLM · knowledge auto-aggiornante</p>
        </div>
        <nav className="tabs" aria-label="Sezioni">
          {([['generate', 'Genera'], ['profiles', 'Profili custom'], ['history', `Cronologia (${history.length})`]] as [Tab, string][]).map(([t, label]) => (
            <button key={t} type="button" className="btn btn-small" aria-pressed={tab === t} onClick={() => setTab(t)}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      {tab === 'generate' && (
        <>
          <TemplatesBar onPick={pickTemplate} />
          <div className="grid-main">
            <section className="panel" aria-label="Input e modelli">
              <div className="panel-head">
                <span>Setup <span className="count">· {selected.length} modelli</span></span>
              </div>
              <div className="panel-body">
                <input
                  id="llm-search"
                  className="search"
                  type="text"
                  placeholder="⌘K · Cerca modelli (es. suno, image, code)…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Cerca modelli"
                />
                <LLMSelector
                  profiles={filtered}
                  selected={selected}
                  onToggle={toggle}
                  onSelectAll={() => setSelected(profiles.map((p) => p.id))}
                  onClear={() => setSelected([])}
                />
              </div>
            </section>

            <section aria-label="Generatore">
              <div className="panel" style={{ marginBottom: 'var(--space-l)' }}>
                <div className="panel-head"><span>Prompt</span></div>
                <div className="panel-body">
                  <PromptInput
                    value={prompt}
                    onChange={setPrompt}
                    onGenerate={generate}
                    generating={generating}
                    canGenerate={Boolean(prompt.trim() && selected.length)}
                  />
                  {error && <div className="error-box" role="alert" style={{ marginTop: 'var(--space-m)' }}>{error}</div>}
                </div>
              </div>

              {generating && (
                <div aria-live="polite">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="skeleton"><div className="bar" style={{ width: '40%' }} /><div className="bar" /><div className="bar" style={{ width: '85%' }} /></div>
                  ))}
                </div>
              )}

              {!generating && results.length > 0 && (
                <>
                  <div className="results-head">
                    <h2>Risultati <span className="count">· {results.length}</span></h2>
                    <div className="actions-row" style={{ marginTop: 0 }}>
                      <button type="button" className="btn btn-small" onClick={copyAll}>Copia tutti</button>
                      <button type="button" className="btn btn-small" onClick={exportPack}>Export Prompt Pack (.md)</button>
                    </div>
                  </div>
                  {results.map((r) => (
                    <GeneratedPromptCard key={r.profileId} item={r} onToast={showToast} />
                  ))}
                </>
              )}

              {!generating && results.length === 0 && (
                <div className="empty">
                  <strong>Nessun risultato ancora</strong>
                  Scrivi il prompt, seleziona i modelli (consiglio: prova “Canzone Suno” o “Immagine cyberpunk” dai template), poi Genera.
                </div>
              )}
            </section>
          </div>
        </>
      )}

      {tab === 'profiles' && (
        <section aria-label="Profili custom">
          {!building ? (
            <>
              <div className="results-head">
                <h2>Profili custom <span className="count">· {profiles.filter((p) => p.isCustom).length}</span></h2>
                <button type="button" className="btn btn-primary" onClick={() => setBuilding(true)}>+ Nuovo profilo (wizard 7 step)</button>
              </div>
              {profiles.filter((p) => p.isCustom).length === 0 ? (
                <div className="empty">
                  <strong>Nessun profilo custom</strong>
                  Crea il tuo primo profilo: nome → stile → struttura → esempi → anti-pattern → fonti → visibilità.
                </div>
              ) : (
                profiles.filter((p) => p.isCustom).map((p) => (
                  <div key={p.id} className="panel" style={{ marginBottom: 'var(--space-s)' }}>
                    <div className="panel-head"><span>{p.name}</span>
                      <button type="button" className="btn btn-small" onClick={() => { setSelected((s) => [...new Set([...s, p.id])]); setTab('generate'); showToast(`Aggiunto ai selezionati: ${p.name}`); }}>Usa →</button>
                    </div>
                    <div className="panel-body"><p style={{ margin: 0, color: 'var(--ink-2)' }}>{p.description}</p></div>
                  </div>
                ))
              )}
              <div className="panel" style={{ marginTop: 'var(--space-l)' }}>
                <div className="panel-head"><span>Profili curati inclusi · {profiles.filter((p) => !p.isCustom).length}</span></div>
                <div className="panel-body" style={{ color: 'var(--ink-2)', fontSize: 'var(--step--1)' }}>
                  {profiles.filter((p) => !p.isCustom).map((p) => p.name).join(' · ')}
                </div>
              </div>
            </>
          ) : (
            <ProfileBuilder onSave={saveCustom} onCancel={() => setBuilding(false)} onToast={showToast} />
          )}
        </section>
      )}

      {tab === 'history' && (
        <section aria-label="Cronologia">
          <HistoryPanel
            history={history}
            onRestore={(h) => { setPrompt(h.originalPrompt); setSelected(h.selectedIds); setResults(h.results); setTab('generate'); showToast('Ripristinato'); }}
            onDelete={(id) => setHistory(deleteHistStore(id))}
            onClear={() => { clearHistStore(); setHistory([]); showToast('Cronologia svuotata'); }}
            onToast={showToast}
          />
        </section>
      )}

      <footer className="footer">
        <span>Prompt Magic v1.0 · 15 profili curati · knowledge versionata · research ogni 14 giorni via GitHub Actions + Firecrawl</span>
        <span>⌘↵ genera · ⌘K cerca · 1-9 toggle · ?prompt=&amp;llms= per link condivisibili</span>
      </footer>

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
