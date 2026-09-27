import type { GenerationRecord } from '../types';
import { timeAgo, copyText, downloadFile } from '../utils/format';

interface Props {
  history: GenerationRecord[];
  onRestore: (h: GenerationRecord) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onToast: (m: string) => void;
}

export default function HistoryPanel({ history, onRestore, onDelete, onClear, onToast }: Props) {
  if (!history.length) {
    return (
      <div className="empty">
        <strong>Nessuna generazione salvata</strong>
        Genera il tuo primo prompt ottimizzato: finirà qui con link condivisibile ed export.
      </div>
    );
  }

  function exportMD(h: GenerationRecord) {
    const md = `# Prompt Magic · ${new Date(h.createdAt).toLocaleString('it-IT')}\n\n## Prompt originale\n${h.originalPrompt}\n\n${h.results.map((r) => `## ${r.profileName}\n\n\`\`\`\n${r.prompt}\n\`\`\`\n`).join('\n')}`;
    downloadFile(`prompt-magic-${h.id}.md`, md, 'text/markdown');
    onToast('Esportato in Markdown');
  }

  function exportJSON(h: GenerationRecord) {
    downloadFile(`prompt-magic-${h.id}.json`, JSON.stringify(h, null, 2), 'application/json');
    onToast('Esportato in JSON');
  }

  async function share(h: GenerationRecord) {
    const url = `${location.origin}${location.pathname}?h=${h.id}`;
    const ok = await copyText(url);
    onToast(ok ? 'Link condivisibile copiato (si apre se la cronologia è in questo browser)' : 'Copia fallita');
  }

  return (
    <div>
      <div className="results-head">
        <h2>Cronologia <span className="count">· {history.length}/100</span></h2>
        <button type="button" className="btn btn-small btn-ghost" onClick={onClear}>Svuota tutto</button>
      </div>
      {history.map((h) => (
        <div key={h.id} className="panel" style={{ marginBottom: 'var(--space-s)' }}>
          <div className="panel-body">
            <div className="hist-q">{h.originalPrompt.slice(0, 140)}{h.originalPrompt.length > 140 ? '…' : ''}</div>
            <div className="hist-m">{timeAgo(h.createdAt)} · {h.results.length} modelli · {h.results.map((r) => r.profileName).join(', ').slice(0, 120)}</div>
            <div className="actions-row" style={{ marginTop: 'var(--space-xs)' }}>
              <button type="button" className="btn btn-small" onClick={() => onRestore(h)}>Ripristina</button>
              <button type="button" className="btn btn-small btn-ghost" onClick={() => exportMD(h)}>MD</button>
              <button type="button" className="btn btn-small btn-ghost" onClick={() => exportJSON(h)}>JSON</button>
              <button type="button" className="btn btn-small btn-ghost" onClick={() => share(h)}>Link</button>
              <button type="button" className="btn btn-small btn-ghost" onClick={() => onDelete(h.id)}>Elimina</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
