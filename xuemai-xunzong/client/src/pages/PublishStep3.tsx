import PhotoComparison from '../components/ai/PhotoComparison';
import OCRResult from '../components/ai/OCRResult';

interface Props {
  restored: { original: string; restored: string } | null;
  ocrResult: { rawText: string; keywords: import('../services/ai-mock').MockKeywordItem[] } | null;
  onNext: () => void;
  onPrev: () => void;
}

export default function PublishStep3({ restored, ocrResult, onNext, onPrev }: Props) {
  return (
    <div className="px-4 pt-2">
      {restored && (
        <PhotoComparison original={restored.original} restored={restored.restored} />
      )}

      {ocrResult && (
        <OCRResult rawText={ocrResult.rawText} keywords={ocrResult.keywords} />
      )}

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
          确认并补充
        </button>
      </div>
    </div>
  );
}
