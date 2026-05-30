import { useEffect, useState } from 'react';

interface Props {
  progress: number;
  statusText: string;
  busy: boolean;
  photoUrl?: string;
  onComplete: () => void;
}

export default function PublishStep2({ progress, statusText, busy, photoUrl, onComplete }: Props) {
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    if (progress >= 80 && !enhanced) {
      const t = window.setTimeout(() => setEnhanced(true), 300);
      return () => window.clearTimeout(t);
    }
  }, [progress, enhanced]);

  useEffect(() => {
    if (!busy && progress >= 100) {
      const t = window.setTimeout(onComplete, 700);
      return () => window.clearTimeout(t);
    }
  }, [busy, progress, onComplete]);

  return (
    <div className="flex flex-col items-center px-4 pt-10 animate-fade-in">
      <div className="mb-6 w-full max-w-[260px] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-sm">
        <div className="flex h-56 items-center justify-center bg-[var(--color-bg-secondary)]">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="上传的线索图片"
              className={`h-full w-full object-cover transition-all duration-700 ${
                enhanced ? 'contrast-110 brightness-105 saturate-110' : 'blur-[1.5px] opacity-80 grayscale-[20%]'
              }`}
            />
          ) : (
            <div className="px-6 text-center text-sm text-[var(--color-text-muted)]">
              正在整理文字线索
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-sm font-medium text-[var(--color-text)]">
            {photoUrl ? '图片预览已生成' : '文字线索已接收'}
          </p>
          <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
            当前为演示版，本机完成图片预览与线索整理。
          </p>
        </div>
      </div>

      <div className="mb-4 h-2.5 w-72 overflow-hidden rounded-full bg-[var(--color-bg-secondary)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary-light)] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mb-6 text-sm text-[var(--color-text-secondary)]">{statusText}</p>

      <div className="w-full max-w-[280px] space-y-3 text-xs">
        {[
          ['读取图片内容', progress >= 35],
          ['生成清晰预览', progress >= 70],
          ['整理可填写线索', progress >= 100],
        ].map(([label, done]) => (
          <div key={String(label)} className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
              done ? 'bg-[var(--color-success)] text-white' : 'border border-[var(--color-border)]'
            }`}>
              {done ? '✓' : ''}
            </span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
