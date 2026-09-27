import { timeAgo } from '../utils/format';

export default function KnowledgeBadge({ updatedAt, sourceCount }: { updatedAt: string; sourceCount: number }) {
  const stale = Date.now() - new Date(updatedAt).getTime() > 14 * 24 * 3600 * 1000;
  return (
    <span className="fresh" title={`Fonti: ${sourceCount} · Ultimo aggiornamento: ${new Date(updatedAt).toLocaleDateString('it-IT')}`}>
      <span className={`dot${stale ? ' stale' : ''}`} aria-hidden="true" />
      {stale ? 'da aggiornare' : 'aggiornato'} · {timeAgo(updatedAt)} · {sourceCount} fonti
    </span>
  );
}
