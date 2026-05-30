import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Settings() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('确定要退出当前演示账号吗？')) {
      logout();
      nav('/login');
    }
  };

  return (
    <div className="pb-8">
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3">
        <button onClick={() => nav(-1)} className="text-sm text-[var(--color-text-muted)]">
          ← 返回
        </button>
        <span className="text-sm font-medium text-[var(--color-text)]">设置</span>
      </div>

      <div className="px-4 pt-5">
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">演示账号</h2>
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[var(--color-text-muted)]">昵称</span>
              <span className="truncate text-[var(--color-text)]">{user?.nickname || 'Demo 用户'}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[var(--color-text-muted)]">账号类型</span>
              <span className="text-[var(--color-text)]">面试演示账号</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[var(--color-text-muted)]">版本</span>
              <span className="text-[var(--color-text)]">MVP Demo 1.0</span>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">隐私边界</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            当前 Demo 使用本地模拟数据，不上传真实通讯录、定位或照片隐私。真实上线前需要补充身份校验、线索审核和敏感信息保护策略。
          </p>
        </section>

        <button
          onClick={handleLogout}
          className="mt-6 h-11 w-full rounded-xl border border-[var(--color-error)] text-sm font-medium text-[var(--color-error)]"
        >
          退出演示账号
        </button>
      </div>
    </div>
  );
}
