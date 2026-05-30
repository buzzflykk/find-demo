import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications, type NotificationItem } from '../hooks/useNotifications';

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  match: { label: '匹配', color: 'bg-amber-100 text-amber-800' },
  message: { label: '消息', color: 'bg-blue-100 text-blue-800' },
  system: { label: '系统', color: 'bg-stone-100 text-stone-800' },
};

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  const pad = (n: number) => String(n).padStart(2, '0');

  if (diffDays === 0) return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (diffDays === 1) return '昨天';
  if (diffDays > 1 && diffDays < 7) return `${diffDays}天前`;
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
}

function NotificationRow({ item, onMark }: { item: NotificationItem; onMark: (id: string) => void }) {
  const nav = useNavigate();
  const meta = TYPE_LABELS[item.type] || { label: '通知', color: 'bg-stone-100 text-stone-800' };

  const handleClick = () => {
    if (!item.is_read) onMark(item.id);
    if (item.related_id && item.type === 'match') {
      nav(`/missing/${item.related_id}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex w-full items-start gap-3 border-b border-[var(--color-border)] px-4 py-3 text-left transition-colors hover:bg-[var(--color-bg-secondary)] ${
        !item.is_read ? 'bg-[var(--color-bg-secondary)]' : ''
      }`}
    >
      <div className={`mt-0.5 shrink-0 rounded px-2 py-0.5 text-[10px] font-medium ${meta.color}`}>
        {meta.label}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className={`truncate text-sm ${!item.is_read ? 'font-medium' : ''} text-[var(--color-text)]`}>
            {item.title}
          </span>
          <span className="shrink-0 text-[10px] text-[var(--color-text-muted)]">
            {formatTime(item.created_at)}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{item.content}</p>
      </div>
      {!item.is_read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />}
    </button>
  );
}

export default function Notifications() {
  const nav = useNavigate();
  const { notifications, loading, loadNotifications, markAsRead } = useNotifications();

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return (
    <div className="pb-8">
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3">
        <button onClick={() => nav(-1)} className="text-sm text-[var(--color-text-muted)]">
          ← 返回
        </button>
        <h2 className="text-sm font-medium text-[var(--color-text)]">通知中心</h2>
      </div>

      {loading && notifications.length === 0 ? (
        <div className="flex items-center justify-center pt-16 text-sm text-[var(--color-text-muted)]">
          加载中...
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-16 text-center">
          <div className="mb-4 text-5xl opacity-70">🔔</div>
          <h2 className="mb-2 text-lg font-medium text-[var(--color-text)]">暂无通知</h2>
          <p className="px-10 text-sm leading-6 text-[var(--color-text-secondary)]">
            匹配结果和系统消息会显示在这里。
          </p>
        </div>
      ) : (
        <div>
          {notifications.map(n => (
            <NotificationRow key={n.id} item={n} onMark={markAsRead} />
          ))}
        </div>
      )}
    </div>
  );
}
