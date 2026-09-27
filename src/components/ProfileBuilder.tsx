import { useState } from 'react';
import type { CustomProfileDraft, FewShot, LLMCategory, LLMKnowledge, LLMProfile } from '../types';
import { CATEGORY_LABELS, EMPTY_DRAFT } from '../types';
import { uid } from '../utils/format';

const STEPS = ['Identità', 'Stile', 'Struttura', 'Esempi', 'Anti-pattern', 'Fonti', 'Visibilità'];
const SECTION_PRESETS = ['Ruolo', 'Contesto', 'Compito', 'Passi', 'Vincoli', 'Formato output', 'Esempi', 'Ragionamento', 'Tono', 'Struttura sezioni'];

interface Props {
  onSave: (profile: LLMProfile, knowledge: LLMKnowledge) => void;
  onCancel: () => void;
  onToast: (m: string) => void;
}

export default function ProfileBuilder({ onSave, onCancel, onToast }: Props) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<CustomProfileDraft>(EMPTY_DRAFT);

  function set<K extends keyof CustomProfileDraft>(k: K, v: CustomProfileDraft[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  function toggleSection(s: string) {
    setDraft((d) => ({
      ...d,
      sections: d.sections.includes(s) ? d.sections.filter((x) => x !== s) : [...d.sections, s],
    }));
  }

  function updateShot(i: number, k: keyof FewShot, v: string) {
    setDraft((d) => {
      const fewShots = d.fewShots.map((s, j) => (j === i ? { ...s, [k]: v } : s));
      return { ...d, fewShots };
    });
  }

  function valid(): string | null {
    if (step === 0 && !draft.name.trim()) return 'Dai un nome al profilo (step 1).';
    if (step === 2 && draft.sections.length === 0) return 'Seleziona almeno una sezione.';
    return null;
  }

  function next() {
    const err = valid();
    if (err) { onToast(err); return; }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function save() {
    if (!draft.name.trim()) { onToast('Nome obbligatorio.'); setStep(0); return; }
    const id = `custom-${draft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || uid('x')}`;
    const profile: LLMProfile = {
      id, name: draft.name.trim(), provider: draft.provider.trim() || 'custom',
      modelVersion: draft.modelVersion.trim() || 'custom-1.0', category: draft.category,
      description: draft.description.trim() || 'Profilo personalizzato.',
      isCurated: false, isCustom: true, updatedAt: new Date().toISOString(), sourceCount: draft.sources.split('\n').filter(Boolean).length,
    };
    const knowledge: LLMKnowledge = {
      profileId: id, version: 1, systemPromptStyle: draft.systemPromptStyle,
      preferredStructure: { sections: draft.sections },
      tokenBudgetGuidance: draft.tokenBudgetGuidance,
      specialTokens: draft.specialTokens.split(',').map((s) => s.trim()).filter(Boolean),
      fewShotExamples: draft.fewShots.filter((s) => s.input.trim() || s.output.trim()),
      antiPatterns: draft.antiPatterns.split(',').map((s) => s.trim()).filter(Boolean),
      sourceUrls: draft.sources.split('\n').map((s) => s.trim()).filter(Boolean),
      notes: 'Profilo creato dall’utente nel Profile Builder.',
    };
    onSave(profile, knowledge);
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <span>Nuovo profilo LLM <span className="count">· {STEPS[step]} ({step + 1}/{STEPS.length})</span></span>
        <button type="button" className="btn btn-small btn-ghost" onClick={onCancel}>Annulla</button>
      </div>
      <div className="panel-body">
        <div className="steps" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span key={s} className={`step${i === step ? ' active' : ''}`}>{i + 1}. {s}</span>
          ))}
        </div>

        {step === 0 && (
          <>
            <div className="field"><label htmlFor="pb-name">Nome *</label><input id="pb-name" type="text" value={draft.name} onChange={(e) => set('name', e.target.value)} placeholder="Es: Il mio tutor di tedesco" /></div>
            <div className="field"><label htmlFor="pb-provider">Provider</label><input id="pb-provider" type="text" value={draft.provider} onChange={(e) => set('provider', e.target.value)} placeholder="openai, anthropic, custom…" /></div>
            <div className="field"><label htmlFor="pb-model">Versione modello</label><input id="pb-model" type="text" value={draft.modelVersion} onChange={(e) => set('modelVersion', e.target.value)} placeholder="gpt-4o, claude-3.5, …" /></div>
            <div className="field"><label htmlFor="pb-desc">Descrizione</label><textarea id="pb-desc" rows={3} value={draft.description} onChange={(e) => set('description', e.target.value)} placeholder="A cosa serve questo profilo?" /></div>
            <div className="field"><label htmlFor="pb-cat">Categoria</label>
              <select id="pb-cat" value={draft.category} onChange={(e) => set('category', e.target.value as LLMCategory)}>
                {(Object.keys(CATEGORY_LABELS) as LLMCategory[]).map((c) => (<option key={c} value={c}>{CATEGORY_LABELS[c]}</option>))}
              </select>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="field"><label htmlFor="pb-style">Stile di system prompt</label><input id="pb-style" type="text" value={draft.systemPromptStyle} onChange={(e) => set('systemPromptStyle', e.target.value)} /></div>
            <div className="field"><label htmlFor="pb-budget">Budget token / guida output</label><input id="pb-budget" type="text" value={draft.tokenBudgetGuidance} onChange={(e) => set('tokenBudgetGuidance', e.target.value)} /></div>
            <div className="field"><label htmlFor="pb-tokens">Special token (separati da virgola)</label><input id="pb-tokens" type="text" value={draft.specialTokens} onChange={(e) => set('specialTokens', e.target.value)} placeholder="<ruolo>, [INST], ### Instruction:" /><small>Lascia vuoto se il modello non ne usa.</small></div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="field"><label>Sezioni struttura (ordine = ordine output)</label>
              <div className="sections-pick">
                {SECTION_PRESETS.map((s) => (
                  <button key={s} type="button" className="btn btn-small" aria-pressed={draft.sections.includes(s)} onClick={() => toggleSection(s)}>{draft.sections.includes(s) ? '✓ ' : '+ '}{s}</button>
                ))}
              </div>
            </div>
            <div className="field"><label htmlFor="pb-custom-sec">Aggiungi sezione custom</label>
              <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                <input id="pb-custom-sec" type="text" value={draft.customSection} onChange={(e) => set('customSection', e.target.value)} placeholder="Es: Schema rima" style={{ flex: 1 }} />
                <button type="button" className="btn" onClick={() => { if (draft.customSection.trim()) { toggleSection(draft.customSection.trim()); set('customSection', ''); } }}>Aggiungi</button>
              </div>
              <small>Attive: {draft.sections.join(' → ') || '—'}</small>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="field"><label>Esempi few-shot (max 5)</label>
            {draft.fewShots.map((s, i) => (
              <div key={i} style={{ border: 'var(--border)', padding: 'var(--space-s)', marginBottom: 'var(--space-s)', background: 'var(--base)' }}>
                <input type="text" aria-label={`Esempio ${i + 1} input`} placeholder="Input esempio" value={s.input} onChange={(e) => updateShot(i, 'input', e.target.value)} style={{ width: '100%', marginBottom: 'var(--space-xs)', background: 'var(--surface)', color: 'var(--ink)', border: 'var(--border)', padding: 'var(--space-xs)' }} />
                <textarea aria-label={`Esempio ${i + 1} output`} placeholder="Output esempio" rows={2} value={s.output} onChange={(e) => updateShot(i, 'output', e.target.value)} style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: 'var(--border)', padding: 'var(--space-xs)' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
              <button type="button" className="btn btn-small" disabled={draft.fewShots.length >= 5} onClick={() => set('fewShots', [...draft.fewShots, { input: '', output: '' }])}>+ Aggiungi</button>
              <button type="button" className="btn btn-small btn-ghost" disabled={draft.fewShots.length <= 1} onClick={() => set('fewShots', draft.fewShots.slice(0, -1))}>− Rimuovi ultimo</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="field"><label htmlFor="pb-anti">Anti-pattern (separati da virgola)</label><textarea id="pb-anti" rows={3} value={draft.antiPatterns} onChange={(e) => set('antiPatterns', e.target.value)} placeholder="risposte vaghe, niente formato, …" /><small>Cose da vietare esplicitamente nel prompt generato.</small></div>
        )}

        {step === 5 && (
          <div className="field"><label htmlFor="pb-src">Fonti documentazione (una URL per riga)</label><textarea id="pb-src" rows={4} value={draft.sources} onChange={(e) => set('sources', e.target.value)} placeholder="https://…" /><small>Servono per badge freschezza e audit.</small></div>
        )}

        {step === 6 && (
          <div className="field"><label>Visibilità</label>
            <label style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
              <input type="checkbox" checked={draft.isPublic} onChange={(e) => set('isPublic', e.target.checked)} />
              Rendi pubblico nella community (fase 2)
            </label>
            <small>Di default i profili sono privati e salvati nel tuo browser{/* + Supabase se configurato */}.</small>
            <div className="empty" style={{ marginTop: 'var(--space-m)' }}>
              <strong>Riepilogo</strong>
              {draft.name || 'Senza nome'} · {CATEGORY_LABELS[draft.category]} · {draft.sections.length} sezioni · {draft.fewShots.filter((s) => s.input || s.output).length} esempi
            </div>
          </div>
        )}

        <div className="wizard-nav">
          <button type="button" className="btn" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>← Indietro</button>
          {step < STEPS.length - 1
            ? <button type="button" className="btn btn-primary" onClick={next}>Avanti →</button>
            : <button type="button" className="btn btn-primary" onClick={save}>✓ Salva profilo</button>}
        </div>
      </div>
    </div>
  );
}
