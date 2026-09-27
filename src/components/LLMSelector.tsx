import type { LLMCategory, LLMProfile } from '../types';
import { CATEGORY_LABELS } from '../types';
import KnowledgeBadge from './KnowledgeBadge';

interface Props {
  profiles: LLMProfile[];
  selected: string[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
}

const ORDER: LLMCategory[] = ['chat', 'code', 'search', 'image', 'music', 'agent', 'open'];

export default function LLMSelector({ profiles, selected, onToggle, onSelectAll, onClear }: Props) {
  return (
    <div>
      <div className="actions-row" style={{ marginTop: 0, marginBottom: 'var(--space-s)' }}>
        <button type="button" className="btn btn-small btn-ghost" onClick={onSelectAll}>
          Seleziona tutti ({profiles.length})
        </button>
        <button type="button" className="btn btn-small btn-ghost" onClick={onClear} disabled={selected.length === 0}>
          Deseleziona
        </button>
      </div>
      {ORDER.map((cat) => {
        const items = profiles.filter((p) => p.category === cat);
        if (!items.length) return null;
        return (
          <div key={cat}>
            <div className="cat">{CATEGORY_LABELS[cat]} · {items.filter((i) => selected.includes(i.id)).length}/{items.length}</div>
            <div className="llm-list" style={{ maxHeight: 'none', overflow: 'visible' }}>
              {items.map((p) => {
                const active = selected.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    className="llm-row"
                    aria-pressed={active}
                    onClick={() => onToggle(p.id)}
                    title={p.description}
                  >
                    <span className="llm-check" aria-hidden="true">{active ? '✓' : ''}</span>
                    <span>
                      <span className="llm-name">{p.name}</span>
                      <span className="llm-sub"> · {p.modelVersion}{p.isCustom ? ' · custom' : ''}</span>
                      <span className="llm-desc" style={{ display: 'block' }}>{p.description}</span>
                      <KnowledgeBadge updatedAt={p.updatedAt} sourceCount={p.sourceCount} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
