interface Props {
  value: string;
  onChange: (v: string) => void;
  onGenerate: () => void;
  generating: boolean;
  canGenerate: boolean;
}

export default function PromptInput({ value, onChange, onGenerate, generating, canGenerate }: Props) {
  const chars = value.length;
  return (
    <div>
      <label htmlFor="prompt" className="cat" style={{ marginTop: 0 }}>
        Il tuo prompt grezzo
      </label>
      <textarea
        id="prompt"
        className="prompt-area"
        placeholder="Es: una ballata malinconica sul mare d'inverno, stile indie folk… oppure: spiega la fotosintesi a un bambino di 8 anni…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby="prompt-meta"
      />
      <div className="prompt-meta" id="prompt-meta">
        <span>{chars} caratteri · ~{Math.ceil(chars / 4)} token stimati</span>
        <span>⌘/Ctrl + Invio per generare</span>
      </div>
      <div className="actions-row">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onGenerate}
          disabled={!canGenerate || generating}
          aria-busy={generating}
        >
          {generating ? 'Generazione…' : '✦ Genera prompt ottimizzati'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => onChange('')} disabled={!value}>
          Pulisci
        </button>
      </div>
      <p className="hint">
        Seleziona uno o più modelli a destra: Prompt Magic riscrive il tuo testo con struttura,
        stile e vincoli specifici per ciascuno. <kbd>1</kbd>–<kbd>9</kbd> per toggle rapido,{' '}
        <kbd>⌘K</kbd> per cercare modelli.
      </p>
    </div>
  );
}
