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

const lostTypeLabels: Record<string, string> = {
  失联: '失联',
  搬家失联: '搬家',
  走失: '走失',
  宠物狗走失: '宠物',
  旧友失联: '旧友',
  老同学: '同学',
  旧信件线索: '信件',
  儿时玩伴: '玩伴',
  老邻居: '邻居',
  其他: '其他',
};

function getDisplayName(targetName: string, title: string) {
  if (targetName) return targetName;
  return title
    .replace(/^寻找\s*/, '')
    .replace(/^找\s*/, '')
    .replace(/^\d{4}\s*年?/, '')
    .trim() || '待补充';
}

export default function MissingCard({
  id,
  title,
  photos,
  targetName,
  lostLocation,
  lostType,
  lostTime,
  description,
}: Props) {
  const navigate = useNavigate();
  const photoUrl = photos?.[0];
  const displayName = getDisplayName(targetName, title);
  const displayLocation = lostLocation || '地点待补充';
  const displayTime = lostTime || '时间待补充';
  const typeLabel = lostTypeLabels[lostType] || lostType || '线索';

  return (
    <div
      onClick={() => navigate(`/missing/${id}`)}
      className="mb-3 cursor-pointer overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] card-shadow"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-[var(--color-bg-secondary)]">
        {photoUrl ? (
          <div className="relative h-full w-full">
            <img src={photoUrl} alt={displayName} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-3">
              <p className="line-clamp-1 text-2xl font-bold leading-tight text-white">{displayName}</p>
              <p className="mt-1 line-clamp-1 text-xs text-white/85">{displayLocation} · {displayTime}</p>
            </div>
          </div>
        ) : (
          <div className="relative flex h-full flex-col justify-between bg-gradient-to-br from-amber-50 to-orange-100 p-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--color-primary)]">
                Text Clue
              </span>
              <span className="rounded-full bg-white/65 px-2 py-0.5 text-[9px] text-[var(--color-text-secondary)]">
                无照片
              </span>
            </div>

            <div>
              <p className="text-[11px] text-[var(--color-text-muted)]">寻找对象</p>
              <p className="line-clamp-2 text-2xl font-bold leading-tight text-[var(--color-primary)]">
                {displayName}
              </p>
            </div>

            <div className="space-y-1">
              <p className="line-clamp-1 text-[12px] font-medium text-[var(--color-text)]">{displayLocation}</p>
              <div className="flex flex-wrap gap-1">
                <span className="rounded-full border border-amber-200 bg-white/65 px-1.5 py-0.5 text-[9px] text-[var(--color-text-secondary)]">
                  {displayTime}
                </span>
                <span className="rounded-full border border-amber-200 bg-white/65 px-1.5 py-0.5 text-[9px] text-[var(--color-primary)]">
                  {typeLabel}
                </span>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full border border-white/60" />
            <div className="pointer-events-none absolute -bottom-10 left-6 h-28 w-28 rounded-full border border-white/45" />
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-[var(--color-text)]">
          {title || `寻找${displayName}`}
        </h3>

        <div className="mb-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[var(--color-bg-secondary)] px-2 py-0.5 text-[11px] text-[var(--color-text-secondary)]">
            {displayLocation}
          </span>
          <span className="rounded-full bg-[var(--color-bg-secondary)] px-2 py-0.5 text-[11px] text-[var(--color-text-secondary)]">
            {displayTime}
          </span>
          <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[11px] text-[var(--color-primary)]">
            {typeLabel}
          </span>
        </div>

        {description && (
          <p className="line-clamp-2 text-[11px] leading-5 text-[var(--color-text-muted)]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
