import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';

const menuItemsBase = [
  { label: '通知中心', path: '/notifications', desc: '匹配结果与系统消息' },
  { label: '我的寻人', path: '/my-missing', desc: '查看我发布过的线索' },
  { label: '已找到档案', path: '/found-archive', desc: '后续沉淀找回记录' },
  { label: '会员中心', path: '/membership', desc: '商业化规划，当前不做真实支付' },
  { label: '设置', path: '/settings', desc: '账号与隐私边界' },
];

export default function Profile() {
  const { user, logout, refresh } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || 'Demo 用户');
  const [saving, setSaving] = useState(false);
  const [notifUnread, setNotifUnread] = useState(0);

  useEffect(() => {
    api.getUnreadNotificationCount().then(d => setNotifUnread(d.count)).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile({ nickname });
      await refresh();
      setEditing(false);
    } catch (e: any) {
      alert(e.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 pb-8 pt-4">
      <section className="mb-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-bg-secondary)] text-2xl">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="h-full w-full rounded-full object-cover" />
            ) : (
              '👤'
            )}
          </div>
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm outline-none focus:border-[var(--color-primary)]"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-[var(--color-primary)] px-3 py-1 text-xs text-white disabled:opacity-50"
                >
                  {saving ? '...' : '保存'}
                </button>
              </div>
            ) : (
              <>
                <p className="truncate font-semibold text-[var(--color-text)]">{user?.nickname || 'Demo 用户'}</p>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Demo 体验账号</p>
              </>
            )}
          </div>
          <button onClick={() => setEditing(!editing)} className="text-xs font-medium text-[var(--color-primary)]">
            编辑
          </button>
        </div>
      </section>

      <section className="mb-4 space-y-2">
        {menuItemsBase.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex w-full items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3 text-left card-shadow transition-colors hover:bg-[var(--color-bg-secondary)]"
          >
            <span>
              <span className="block text-sm font-medium text-[var(--color-text)]">{item.label}</span>
              <span className="mt-0.5 block text-xs text-[var(--color-text-muted)]">{item.desc}</span>
            </span>
            <span className="flex items-center gap-2">
              {item.path === '/notifications' && notifUnread > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-medium text-white">
                  {notifUnread > 99 ? '99+' : notifUnread}
                </span>
              )}
              <span className="text-[var(--color-text-muted)]">&gt;</span>
            </span>
          </button>
        ))}
      </section>

      <button
        onClick={() => {
          logout();
          navigate('/login');
        }}
        className="h-11 w-full rounded-xl border border-[var(--color-error)] text-sm font-medium text-[var(--color-error)]"
      >
        退出登录
      </button>
    </div>
  );
}
