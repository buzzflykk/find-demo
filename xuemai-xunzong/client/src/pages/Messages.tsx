import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessages, type Conversation } from '../hooks/useMessages';
import { useNotifications, type NotificationItem } from '../hooks/useNotifications';

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  if (d.toDateString() === now.toDateString()) return time;

  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 1) return '昨天';
  if (diffDays > 1 && diffDays < 7) return `${diffDays}天前`;
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
}

const NOTIF_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  match: { label: '匹配', color: 'bg-amber-100 text-amber-800' },
  message: { label: '消息', color: 'bg-blue-100 text-blue-800' },
  system: { label: '系统', color: 'bg-stone-100 text-stone-800' },
};

function ConversationItem({ conv }: { conv: Conversation }) {
  const nav = useNavigate();
  const lastContent = conv.msg_type === 'image' ? '[图片]' : conv.content;

  return (
    <button
      onClick={() => nav(`/chat/${conv.missing_person_id}/${conv.other_user_id}`)}
      className="flex w-full items-start gap-3 border-b border-[var(--color-border)] px-4 py-3 text-left transition-colors hover:bg-[var(--color-bg-secondary)]"
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[var(--color-bg-secondary)]">
        {conv.other_user_avatar ? (
          <img src={conv.other_user_avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-[var(--color-primary)]">
            {(conv.other_user_name || '线').charAt(0)}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-medium text-[var(--color-text)]">
            {conv.other_user_name || '线索联系人'}
          </span>
          <span className="shrink-0 text-[10px] text-[var(--color-text-muted)]">
            {formatTime(conv.last_msg_at)}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-[var(--color-text-secondary)]">
          {conv.missing_title ? `关于：${conv.missing_title}` : '线索沟通'}
        </p>
        <p className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">{lastContent}</p>
      </div>
      {conv.unread_count > 0 && (
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--color-primary)] px-1.5 text-[10px] font-medium text-white">
          {conv.unread_count > 99 ? '99+' : conv.unread_count}
        </span>
      )}
    </button>
  );
}

function NotificationItem({ item }: { item: NotificationItem }) {
  const nav = useNavigate();
  const meta = NOTIF_TYPE_LABELS[item.type] || { label: '通知', color: 'bg-stone-100 text-stone-800' };

  return (
    <button
      onClick={() => {
        if (item.related_id && item.type === 'match') {
          nav(`/missing/${item.related_id}`);
        } else {
          nav('/notifications');
        }
      }}
      className="flex w-full items-start gap-3 border-b border-[var(--color-border)] px-4 py-3 text-left transition-colors hover:bg-[var(--color-bg-secondary)]"
    >
      <div className={`mt-0.5 shrink-0 rounded px-2 py-0.5 text-[10px] font-medium ${meta.color}`}>
        {meta.label}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm text-[var(--color-text)]">{item.title}</span>
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

export default function Messages() {
  const [tab, setTab] = useState<'chat' | 'notice'>('chat');
  const { conversations, unreadTotal, loadConversations } = useMessages();
  const { notifications, loadNotifications } = useNotifications();

  useEffect(() => {
    loadConversations();
    const interval = window.setInterval(loadConversations, 10000);
    return () => window.clearInterval(interval);
  }, [loadConversations]);

  useEffect(() => {
    if (tab === 'notice') {
      loadNotifications();
    }
  }, [tab, loadNotifications]);

  return (
    <div className="pt-4">
      <div className="mb-2 flex gap-4 border-b border-[var(--color-border)] px-4">
        <button
          onClick={() => setTab('chat')}
          className={`relative pb-2 text-sm font-medium transition-colors ${
            tab === 'chat'
              ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'text-[var(--color-text-muted)]'
          }`}
        >
          私信
          {unreadTotal > 0 && (
            <span className="absolute -right-3 -top-0.5 flex h-4 min-w-[14px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-medium text-white">
              {unreadTotal > 9 ? '9+' : unreadTotal}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('notice')}
          className={`pb-2 text-sm font-medium transition-colors ${
            tab === 'notice'
              ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'text-[var(--color-text-muted)]'
          }`}
        >
          通知
        </button>
      </div>

      {tab === 'chat' && (
        <div>
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-16 text-center">
              <div className="mb-4 text-5xl opacity-60">💬</div>
              <h2 className="mb-2 text-lg font-medium text-[var(--color-text)]">暂无私信</h2>
              <p className="px-10 text-sm leading-6 text-[var(--color-text-secondary)]">
                在详情页提供线索后，对话会同步出现在这里。
              </p>
            </div>
          ) : (
            <div>
              {conversations.map((conv, i) => (
                <ConversationItem key={`${conv.missing_person_id}-${conv.other_user_id}-${i}`} conv={conv} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'notice' && (
        <div>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-16 text-center">
              <div className="mb-4 text-5xl opacity-60">🔔</div>
              <h2 className="mb-2 text-lg font-medium text-[var(--color-text)]">暂无通知</h2>
              <p className="px-10 text-sm leading-6 text-[var(--color-text-secondary)]">
                匹配结果和系统消息会显示在这里。
              </p>
            </div>
          ) : (
            <div>
              {notifications.slice(0, 20).map(n => (
                <NotificationItem key={n.id} item={n} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
