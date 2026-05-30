import { useState } from 'react';
import PosterTemplates from '../components/ai/PosterTemplates';

interface Props {
  photoUrl?: string;
  targetName: string;
  lostTime: string;
  lostLocation: string;
  description: string;
  onTemplateChange: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function PublishStep5({
  photoUrl,
  targetName,
  lostTime,
  lostLocation,
  description,
  onTemplateChange,
  onNext,
  onPrev,
}: Props) {
  const [selected, setSelected] = useState(0);

  const handleSelect = (i: number) => {
    setSelected(i);
    onTemplateChange(i);
  };

  return (
    <div className="px-4 pt-2">
      <div className="mb-6">
        <PosterTemplates
          photoUrl={photoUrl}
          targetName={targetName}
          lostTime={lostTime}
          lostLocation={lostLocation}
          description={description}
          selectedIndex={selected}
          onChange={handleSelect}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPrev}
          className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] py-2.5 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-secondary)]"
        >
          上一步
        </button>
        <button
          onClick={onNext}
          className="flex-1 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand)]"
        >
          确认并发布
        </button>
      </div>
    </div>
  );
}
