import { useState } from 'react';
import type { GeneratedPrompt } from '../types';
import { copyText } from '../utils/format';

export default function GeneratedPromptCard({ item, onToast }: { item: GeneratedPrompt; onToast: (m: string) => void }) {
  const [open, setOpen] = useState(true);

  async function copy() {
    const ok = await copyText(item.prompt);
    onToast(ok ? `Copiato: ${item.profileName}` : 'Copia fallita — seleziona manualmente');
  }

  return (
    <article className="panel result">
      <div className="panel-head">
        <span>{item.profileName}</span>
        <span className="result-actions">
          <span className="result-meta" style={{ alignSelf: 'center' }}>
            {item.charCount} ch · ~{item.estTokens} tok
          </span>
          <button type="button" className="btn btn-small" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
            {open ? 'Nascondi' : 'Mostra'}
          </button>
          <button type="button" className="btn btn-small btn-primary" onClick={copy}>
            Copia
          </button>
        </span>
      </div>
      {open && <pre>{item.prompt}</pre>}
    </article>
  );
}
