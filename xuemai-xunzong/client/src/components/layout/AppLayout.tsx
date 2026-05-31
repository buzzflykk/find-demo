import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import BottomNav from './BottomNav';
import { useTheme } from '../common/ThemeProvider';

export default function AppLayout() {
  const { user, loading } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const showFab = ['/home', '/explore'].includes(location.pathname);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
        <p>加载中...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="shrink-0 flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <button onClick={() => navigate('/home')} className="text-left">
          <h1 className="text-lg font-bold leading-tight text-[var(--color-brand)]">时光印记</h1>
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
            DEMO
          </p>
        </button>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-secondary)]">
            面试演示版
          </span>
          <button
            onClick={toggle}
            className="rounded-full p-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
            title={theme === 'light' ? '切换夜间模式' : '切换白天模式'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4 animate-fade-in">
        <Outlet />
      </main>
      {showFab && (
        <button
          onClick={() => navigate('/publish')}
          className="absolute bottom-[86px] right-7 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-2xl font-light text-white shadow-lg transition-colors hover:bg-[var(--color-accent-light)]"
          aria-label="发布新寻人"
        >
          +
        </button>
      )}
      <BottomNav />
    </div>
  );
}
