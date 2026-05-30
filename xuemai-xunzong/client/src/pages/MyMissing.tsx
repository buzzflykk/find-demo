import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { getLocalPublishedMissing, mergeMissingItems, normalizePhotos } from '../services/demoDataStore';

interface MissingItem {
  id: string;
  title: string;
  photos: string | string[];
  status: string;
  target_name: string;
  lost_time: string;
  lost_location: string;
  match_count: number;
  created_at: string;
}

export default function MyMissing() {
  const nav = useNavigate();
  const [items, setItems] = useState<MissingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'found'>('all');

  useEffect(() => {
    (async () => {
      const localItems = getLocalPublishedMissing() as MissingItem[];
      try {
        const data = await api.getMyMissing();
        setItems(mergeMissingItems<MissingItem>(data.items, localItems as any));
      } catch {
        setItems(localItems);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = filter === 'all'
    ? items
    : items.filter(i => i.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-24 text-sm text-[var(--color-text-muted)]">
        加载中...
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3">
        <button onClick={() => nav(-1)} className="text-sm text-[var(--color-text-muted)]">
          ← 返回
        </button>
        <span className="text-sm font-medium text-[var(--color-text)]">我的寻人</span>
      </div>

      <div className="flex gap-2 border-b border-[var(--color-border)] px-4 py-2">
        {(['all', 'active', 'found'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${
              filter === f
                ? 'bg-[var(--color-primary)] text-white'
                : 'border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'
            }`}
          >
            {f === 'all' ? '全部' : f === 'active' ? '寻人中' : '已找到'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-16 text-center">
          <div className="mb-4 text-5xl opacity-70">📋</div>
          <h2 className="mb-2 text-lg font-medium text-[var(--color-text)]">
            {filter === 'all' ? '暂无寻人记录' : filter === 'active' ? '暂无寻人中记录' : '暂无已找到记录'}
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            发布的第一条寻人信息会显示在这里
          </p>
          <button
            onClick={() => nav('/publish')}
            className="mt-4 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm text-white"
          >
            发布寻人
          </button>
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-border)]">
          {filtered.map(item => {
            const photos = normalizePhotos(item.photos);
            return (
              <button
                key={item.id}
                onClick={() => nav(`/missing/${item.id}`)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-bg-secondary)]"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[var(--color-bg-secondary)]">
                  {photos[0] ? (
                    <img src={photos[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-lg text-[var(--color-text-muted)]">👤</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-[var(--color-text)]">
                      {item.title || item.target_name || '未命名线索'}
                    </span>
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      item.status === 'found' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status === 'found' ? '已找到' : '寻人中'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    {item.lost_location || '地点未知'} · {item.lost_time || '时间未知'}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">
                    {item.match_count || 0} 个匹配
                  </p>
                </div>
                <span className="text-xs text-[var(--color-text-muted)]">&gt;</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
