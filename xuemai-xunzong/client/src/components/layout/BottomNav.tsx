import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

const tabs = [
  { path: '/home', label: '时光机', icon: '🏠' },
  { path: '/explore', label: '发现', icon: '🔍' },
  { path: '/messages', label: '消息', icon: '💬' },
  { path: '/profile', label: '我的', icon: '👤' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifUnread, setNotifUnread] = useState(0);
  const [msgUnread, setMsgUnread] = useState(0);

  useEffect(() => {
    const load = () => {
      api.getUnreadNotificationCount().then(d => setNotifUnread(d.count)).catch(() => {});
      api.getUnreadTotal().then(d => setMsgUnread(d.total)).catch(() => {});
    };
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const showBadge = (path: string) => {
    if (path === '/messages') return msgUnread;
    if (path === '/profile') return notifUnread;
    return 0;
  };

  return (
    <nav className="relative z-50 shrink-0 border-t border-[var(--color-border)] bg-[var(--color-bg)] shadow-[0_-8px_24px_rgba(60,36,21,0.04)]">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-2 pt-2">
        {tabs.map(tab => {
          const active = location.pathname === tab.path;
          const badge = showBadge(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-1 text-sm transition-colors ${
                active
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)]'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
              {badge > 0 && (
                <span className="absolute -right-1 top-0 flex h-4 min-w-[14px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-medium text-white">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
