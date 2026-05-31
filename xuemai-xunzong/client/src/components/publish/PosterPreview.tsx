interface Props {
  photoUrl?: string;
  targetName: string;
  lostTime: string;
  lostLocation: string;
  description: string;
  templateIndex: number;
}

const templates = [
  {
    name: '温暖',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-100',
    text: 'text-stone-800',
    accent: 'text-amber-700',
    border: 'border-amber-200',
  },
  {
    name: '素雅',
    bg: 'bg-gradient-to-br from-gray-50 to-stone-100',
    text: 'text-gray-800',
    accent: 'text-stone-700',
    border: 'border-stone-200',
  },
  {
    name: '旧日',
    bg: 'bg-gradient-to-br from-yellow-50 to-amber-100',
    text: 'text-stone-800',
    accent: 'text-yellow-800',
    border: 'border-yellow-200',
  },
];

export default function PosterPreview({
  photoUrl,
  targetName = '',
  lostTime = '',
  lostLocation = '',
  description = '',
  templateIndex,
}: Props) {
  const tmpl = templates[templateIndex] || templates[0];
  const hasPhoto = Boolean(photoUrl);
  const displayName = targetName || '待补充';
  const displayTime = lostTime || '待补充';
  const displayLocation = lostLocation || '待补充';
  const displayReason = description || '请补充失踪经过、最后出现位置、衣着特征或其他可帮助识别的线索。';

  return (
    <div className={`overflow-hidden rounded-xl border ${tmpl.border} ${tmpl.bg} shadow-sm`}>
      <div className="relative min-h-48 overflow-hidden bg-black/5">
        {hasPhoto && (
          <img src={photoUrl} alt="线索图片" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className={`relative flex min-h-48 flex-col justify-between p-4 ${hasPhoto ? 'bg-black/45 text-white' : ''}`}>
          <div className="flex items-start justify-between gap-3">
            <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${hasPhoto ? 'text-white/85' : tmpl.accent}`}>
              CLUE CARD
            </p>
            {!hasPhoto && (
              <span className={`rounded-full border ${tmpl.border} bg-white/45 px-2.5 py-1 text-xs ${tmpl.text}`}>
                无照片
              </span>
            )}
          </div>

          <div>
            <p className={`text-sm ${hasPhoto ? 'text-white/80' : tmpl.text}`}>寻找对象</p>
            <h2 className={`mt-1 text-3xl font-bold leading-tight ${hasPhoto ? 'text-white' : tmpl.accent}`}>
              {displayName}
            </h2>
            <p className={`mt-4 text-sm ${hasPhoto ? 'text-white/80' : tmpl.text}`}>失联地点</p>
            <p className={`mt-1 line-clamp-2 text-2xl font-bold leading-tight ${hasPhoto ? 'text-white' : tmpl.text}`}>
              {displayLocation}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <DetailRow label="名字" value={displayName} textClass={tmpl.text} />
        <DetailRow label="时间" value={displayTime} textClass={tmpl.text} />
        <DetailRow label="地点" value={displayLocation} textClass={tmpl.text} />
        <div className={`rounded-lg border ${tmpl.border} bg-white/35 p-3`}>
          <p className={`mb-1 text-xs font-medium ${tmpl.accent}`}>详细失踪原因</p>
          <p className={`text-sm leading-6 ${tmpl.text}`}>{displayReason}</p>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, textClass }: { label: string; value: string; textClass: string }) {
  return (
    <div className={`flex items-start gap-3 text-sm ${textClass}`}>
      <span className="shrink-0 text-xs text-[var(--color-text-muted)]">{label}</span>
      <span className="font-medium leading-5">{value}</span>
    </div>
  );
}

export { templates };
