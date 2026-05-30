import PosterPreview, { templates } from '../../components/publish/PosterPreview';

interface Props {
  photoUrl?: string;
  targetName: string;
  lostTime: string;
  lostLocation: string;
  description: string;
  selectedIndex: number;
  onChange: (index: number) => void;
}

export default function PosterTemplates({
  photoUrl,
  targetName,
  lostTime,
  lostLocation,
  description,
  selectedIndex,
  onChange,
}: Props) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-[var(--color-text)]">选择分享卡模板</h3>
      <div className="mb-4 flex gap-2">
        {templates.map((t, i) => (
          <button
            key={t.name}
            onClick={() => onChange(i)}
            className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
              selectedIndex === i
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <h3 className="mb-2 text-sm font-medium text-[var(--color-text)]">预览效果</h3>
      <div className="mx-auto max-w-sm">
        <PosterPreview
          photoUrl={photoUrl}
          targetName={targetName}
          lostTime={lostTime}
          lostLocation={lostLocation}
          description={description}
          templateIndex={selectedIndex}
        />
      </div>
    </div>
  );
}
