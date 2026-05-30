interface Props {
  original: string;
  restored: string;
}

export default function PhotoComparison({ original, restored }: Props) {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-sm font-medium text-[var(--color-text)]">图片整理结果</h3>
      <div className="flex gap-3 overflow-x-auto pb-1">
        <div className="shrink-0">
          <p className="mb-1 text-xs text-[var(--color-text-muted)]">原图</p>
          <div className="relative h-32 w-32 overflow-hidden rounded-lg bg-[var(--color-bg-secondary)]">
            <img src={original} alt="原图" className="h-full w-full object-cover opacity-70 grayscale-[15%]" />
          </div>
        </div>
        <div className="shrink-0">
          <p className="mb-1 text-xs text-[var(--color-text-muted)]">预览增强</p>
          <div className="relative h-32 w-32 overflow-hidden rounded-lg ring-2 ring-[var(--color-primary)]">
            <img src={restored} alt="预览增强" className="h-full w-full object-cover contrast-110 brightness-105 saturate-110" />
            <span className="absolute bottom-1 right-1 rounded bg-[var(--color-primary)] px-1.5 py-0.5 text-[10px] text-white">
              已整理
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
