import { useNavigate } from 'react-router-dom';

interface Props {
  id: string;
  title: string;
  photos: string[];
  targetName: string;
  lostLocation: string;
  lostType: string;
  lostTime?: string;
  description?: string;
  viewCount: number;
  matchCount: number;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} 天前`;
  return new Date(dateStr).toLocaleDateString('zh-CN');
}

const lostTypeLabels: Record<string, string> = {
  失联: '失联',
  搬家失联: '搬家',
  走失: '走失',
  其他: '其他',
  旧友失联: '旧友',
  宠物狗走失: '宠物',
  老同学: '同学',
  旧信件线索: '信件',
  儿时玩伴: '玩伴',
  老邻居: '邻居',
};

export default function MissingCard({ id, title, photos, targetName, lostLocation, lostType, viewCount, matchCount, createdAt }: Props) {
  const navigate = useNavigate();
  const photoUrl = photos?.[0];
  const displayTitle = title || (targetName ? `寻找${targetName}` : '未命名线索');
  const year = createdAt && !Number.isNaN(new Date(createdAt).getTime())
    ? new Date(createdAt).getFullYear().toString()
    : '线索';
  const typeLabel = lostTypeLabels[lostType] || lostType;

  return (
    <div
      onClick={() => navigate(`/missing/${id}`)}
      className="mb-3 cursor-pointer overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] card-shadow"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-[var(--color-bg-secondary)]">
        {photoUrl ? (
          <img src={photoUrl} alt={displayTitle} className="h-full w-full object-cover" />
        ) : (
          <div className="relative flex h-full flex-col justify-between bg-gradient-to-br from-amber-50 to-orange-100 p-3">
            <div className="flex items-start justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--color-primary)]">
                Text Clue
              </span>
              <span className="rounded-full bg-white/60 px-2 py-0.5 text-[9px] text-[var(--color-text-secondary)]">
                无照片
              </span>
            </div>
            <div>
              <p className="text-[11px] text-[var(--color-text-muted)]">可能地点</p>
              <p className="line-clamp-2 text-xl font-bold leading-tight text-[var(--color-primary)]">
                {lostLocation || '待补充'}
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="rounded-full border border-amber-200 bg-white/60 px-1.5 py-0.5 text-[9px] text-[var(--color-text-secondary)]">
                {year}
              </span>
              {lostType && (
                <span className="rounded-full border border-amber-200 bg-white/60 px-1.5 py-0.5 text-[9px] text-[var(--color-text-secondary)]">
                  {typeLabel}
                </span>
              )}
            </div>
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full border border-white/60" />
            <div className="pointer-events-none absolute -bottom-10 left-6 h-28 w-28 rounded-full border border-white/45" />
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="mb-1.5 line-clamp-2 text-sm font-semibold leading-snug text-[var(--color-text)]">
          {displayTitle}
        </h3>

        <div className="mb-2 flex flex-wrap gap-1.5">
          {lostLocation && (
            <span className="rounded-full bg-[var(--color-bg-secondary)] px-2 py-0.5 text-[11px] text-[var(--color-text-secondary)]">
              {lostLocation}
            </span>
          )}
          {lostType && (
            <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[11px] text-[var(--color-primary)]">
              {typeLabel}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1 text-[11px] leading-tight text-[var(--color-text-muted)]">
          <span>{viewCount} 次浏览</span>
          <span>{matchCount} 个匹配</span>
          <span className="text-right">{timeAgo(createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
