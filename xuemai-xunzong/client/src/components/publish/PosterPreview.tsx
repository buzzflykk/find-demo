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
  const shortName = targetName || '旧友';
  const yearMatch = lostTime.match(/\d{4}/);
  const year = yearMatch?.[0] || '未知年份';
  const location = lostLocation || '未知地点';
  const descriptionTags = description
    .split(/[，。、\s]+/)
    .map(t => t.trim())
    .filter(Boolean)
    .slice(0, 3);
  const clueTags = [year, location, ...descriptionTags].slice(0, 5);

  return (
    <div className={`overflow-hidden rounded-xl border ${tmpl.border} ${tmpl.bg} shadow-sm`}>
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-black/5">
        {hasPhoto ? (
          <img src={photoUrl} alt="寻人线索图片" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col justify-between p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-xs font-medium ${tmpl.accent}`}>TEXT CLUE</p>
                <p className={`mt-1 text-3xl font-bold ${tmpl.text}`}>{year}</p>
              </div>
              <div className={`rounded-full border ${tmpl.border} bg-white/45 px-2.5 py-1 text-xs ${tmpl.text}`}>
                无照片
              </div>
            </div>
            <div>
              <p className={`text-sm ${tmpl.text}`}>可能地点</p>
              <p className={`mt-1 line-clamp-2 text-2xl font-bold leading-tight ${tmpl.accent}`}>
                {location}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {clueTags.map(tag => (
                <span
                  key={tag}
                  className={`rounded-full border ${tmpl.border} bg-white/50 px-2 py-0.5 text-[11px] ${tmpl.text}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className={`mb-2 text-xl font-bold ${tmpl.accent}`}>
          寻找{shortName}
        </h2>

        <div className={`mb-3 space-y-1 text-sm ${tmpl.text}`}>
          {lostTime && (
            <p>
              <span className="font-medium">失联时间：</span>
              {lostTime}
            </p>
          )}
          {lostLocation && (
            <p>
              <span className="font-medium">失联地点：</span>
              {lostLocation}
            </p>
          )}
        </div>

        {description && (
          <p className={`line-clamp-3 text-sm leading-relaxed ${tmpl.text}`}>
            {description}
          </p>
        )}

        <div className={`mt-4 border-t ${tmpl.border} pt-3 text-center text-xs ${tmpl.text}`}>
          时光印记 · 寻人
        </div>
      </div>
    </div>
  );
}

export { templates };
