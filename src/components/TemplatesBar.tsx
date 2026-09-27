export interface QuickTemplate {
  label: string;
  prompt: string;
  llms: string[];
}

export const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    label: 'Code review',
    prompt: 'Fai la code review di questa funzione: trova bug, problemi di performance e suggerisci un refactor minimo con test.',
    llms: ['chatgpt', 'claude', 'opencode', 'copilot'],
  },
  {
    label: 'Articolo SEO',
    prompt: 'Scrivi un articolo di 800 parole su un tema a scelta: struttura H2/H3, tono autorevole, CTA finale.',
    llms: ['chatgpt', 'claude', 'gemini'],
  },
  {
    label: 'Analisi dati',
    prompt: 'Analizza questo dataset: trend principali, anomalie, 3 raccomandazioni azionabili con livello di confidenza.',
    llms: ['chatgpt', 'claude', 'gemini', 'deepseek'],
  },
  {
    label: 'Ricerca verificata',
    prompt: 'Confronta due soluzioni con fonti aggiornate al 2026: pro/contro, costi, verdetto motivato.',
    llms: ['perplexity', 'chatgpt', 'gemini'],
  },
  {
    label: 'Canzone Suno',
    prompt: "Una ballata malinconica sul mare d'inverno, stile indie folk, voce femminile delicata",
    llms: ['suno-style', 'suno-lyrics'],
  },
  {
    label: 'Immagine cyberpunk',
    prompt: 'Un gatto cyberpunk che guarda la pioggia neon da una finestra, mood blade runner',
    llms: ['chatgpt-image'],
  },
  {
    label: 'Debug ragionato',
    prompt: 'Questo algoritmo fallisce su input grandi: trova la causa con ragionamento esplicito e proponi fix verificabile.',
    llms: ['deepseek', 'claude', 'chatgpt', 'opencode'],
  },
  {
    label: 'Traduzione tecnica',
    prompt: "Traduci questa documentazione tecnica in italiano mantenendo i termini standard in inglese.",
    llms: ['qwen', 'mistral', 'claude'],
  },
];

export default function TemplatesBar({ onPick }: { onPick: (t: QuickTemplate) => void }) {
  return (
    <div className="templates" role="toolbar" aria-label="Template rapidi">
      {QUICK_TEMPLATES.map((t) => (
        <button key={t.label} type="button" className="btn btn-small btn-ghost" onClick={() => onPick(t)} title={t.prompt}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
