import { useNavigate } from 'react-router-dom';

interface Props {
  publishedId: string | null;
  publishing: boolean;
  error: string;
  onPublish: () => Promise<void>;
}

export default function PublishStep6({ publishedId, publishing, error, onPublish }: Props) {
  const navigate = useNavigate();

  if (publishedId) {
    return (
      <div className="flex flex-col items-center justify-center px-4 pt-16 text-center">
        <div className="mb-4 text-5xl">✓</div>
        <h2 className="mb-2 text-xl font-bold text-[var(--color-text)]">发布成功</h2>
        <p className="mb-3 text-sm leading-6 text-[var(--color-text-secondary)]">
          寻人信息已进入公共池，其他用户可以在首页和发现页看到。
        </p>
        {error && (
          <p className="mb-6 rounded-lg bg-[var(--color-primary)]/10 px-3 py-2 text-xs leading-relaxed text-[var(--color-primary)]">
            {error}
          </p>
        )}
        <div className="flex w-full max-w-[280px] flex-col gap-3">
          <button
            onClick={() => navigate(`/missing/${publishedId}`)}
            className="rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand)]"
          >
            查看详情
          </button>
          <button
            onClick={() => navigate('/home')}
            className="rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-secondary)]"
          >
            返回时光机
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
        <h3 className="mb-4 text-lg font-medium text-[var(--color-text)]">发布确认</h3>

        <div className="mb-4 space-y-3 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="accent-[var(--color-primary)]" />
            <span className="text-[var(--color-text)]">发布到 App 公共寻人池</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="accent-[var(--color-primary)]" />
            <span className="text-[var(--color-text)]">允许其他用户私聊提供线索</span>
          </label>
        </div>

        <p className="mb-6 text-xs leading-relaxed text-[var(--color-text-muted)]">
          发布后，你可以在“我的寻人”查看记录，也可以继续分享给可能知情的人。
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 px-3 py-2 text-xs leading-relaxed text-[var(--color-error)]">
            {error}
          </div>
        )}

        <button
          onClick={onPublish}
          disabled={publishing}
          className="w-full rounded-lg bg-[var(--color-accent)] py-2.5 font-medium text-white transition-colors hover:bg-[var(--color-accent-light)] disabled:opacity-50"
        >
          {publishing ? '发布中...' : '确认发布'}
        </button>
      </div>
    </div>
  );
}
