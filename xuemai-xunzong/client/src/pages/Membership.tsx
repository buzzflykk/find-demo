import { useNavigate } from 'react-router-dom';

export default function Membership() {
  const nav = useNavigate();

  return (
    <div className="pb-8">
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3">
        <button onClick={() => nav(-1)} className="text-sm text-[var(--color-text-muted)]">
          ← 返回
        </button>
        <span className="text-sm font-medium text-[var(--color-text)]">会员中心</span>
      </div>

      <div className="flex min-h-[460px] flex-col items-center justify-center px-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-secondary)] text-3xl">
          ✦
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text)]">暂未开放</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
          当前 Demo 聚焦寻人发布、公共池传播和线索反馈。会员能力将在后续版本开放。
        </p>
        <button
          onClick={() => nav('/home')}
          className="mt-6 h-11 w-full rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white"
        >
          返回时光机
        </button>
      </div>
    </div>
  );
}
