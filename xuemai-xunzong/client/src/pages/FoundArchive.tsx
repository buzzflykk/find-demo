import { useNavigate } from 'react-router-dom';

export default function FoundArchive() {
  const nav = useNavigate();

  return (
    <div className="pb-8">
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3">
        <button onClick={() => nav(-1)} className="text-sm text-[var(--color-text-muted)]">
          ← 返回
        </button>
        <span className="text-sm font-medium text-[var(--color-text)]">已找到档案</span>
      </div>

      <div className="flex min-h-[460px] flex-col items-center justify-center px-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-bg-secondary)] text-3xl">
          ✓
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text)]">暂无找回记录</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
          当寻人状态标记为“已找到”后，记录会自动归档到这里。
        </p>
        <button
          onClick={() => nav('/my-missing')}
          className="mt-6 h-11 w-full rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white"
        >
          查看我的寻人
        </button>
      </div>
    </div>
  );
}
