import { useEffect, useState, useRef, useCallback } from 'react';
import { api } from '../lib/api';
import MissingCard from '../components/missing/MissingCard';
import { mergeMissingItems } from '../services/demoDataStore';

type FeedItem = {
  id: string;
  title: string;
  photos: string[];
  target_name: string;
  lost_location: string;
  lost_type: string;
  lost_time?: string;
  description?: string;
  view_count: number;
  match_count: number;
  created_at: string;
};

const demoItems: FeedItem[] = [
  {
    id: 'demo-old-photo',
    title: '寻找 2005 年小学毕业照里的李明',
    photos: [],
    target_name: '李明',
    lost_location: '成都 武侯区',
    lost_type: '搬家失联',
    lost_time: '2005',
    description: '小学毕业后搬家失联，只记得同班和大概住址。',
    view_count: 1286,
    match_count: 3,
    created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: 'demo-letter',
    title: '旧信件里的广州陈阿姨',
    photos: [],
    target_name: '陈阿姨',
    lost_location: '广州 越秀区',
    lost_type: '失联',
    lost_time: '1998',
    description: '从旧信件中识别出建设二路、陈秀兰等线索。',
    view_count: 842,
    match_count: 2,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
  },
  {
    id: 'demo-neighbor',
    title: '福州老巷里的儿时玩伴阿花',
    photos: [],
    target_name: '阿花',
    lost_location: '福州 台江区',
    lost_type: '其他',
    lost_time: '1995-1998',
    description: '只记得同巷和小名，缺少照片。',
    view_count: 621,
    match_count: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
  },
];

export default function Home() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scope, setScope] = useState<'local' | 'all'>('local');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [localCity, setLocalCity] = useState('成都');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchItems = useCallback(async (p: number, append: boolean) => {
    try {
      if (append) setLoadingMore(true);
      const data = await api.getMissingList(p);
      const mapped: FeedItem[] = data.items.map((i: any) => ({
        id: i.id,
        title: i.title,
        photos: typeof i.photos === 'string' ? JSON.parse(i.photos) : i.photos || [],
        target_name: i.target_name,
        lost_location: i.lost_location,
        lost_type: i.lost_type,
        lost_time: i.lost_time,
        description: i.description,
        view_count: i.view_count || 0,
        match_count: i.match_count || 0,
        created_at: i.created_at,
      }));
      setItems(prev => append ? mergeMissingItems([...prev, ...mapped]) : mergeMissingItems(mapped));
      setHasMore(mapped.length >= 20);
      setPage(p);
      setError('');
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(1, false);
  }, [fetchItems]);

  useEffect(() => {
    if (!sentinelRef.current || error || items.length === 0) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchItems(page + 1, true);
        }
      },
      { threshold: 0.1 },
    );
    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, loading, page, fetchItems, error, items.length]);

  const useDemoFeed = !loading && (error || items.length === 0);
  const sourceFeed = mergeMissingItems(useDemoFeed ? demoItems : items);
  const feed = scope === 'local' && locationEnabled
    ? sourceFeed.filter(item => item.lost_location?.includes(localCity))
    : sourceFeed;
  const localCount = sourceFeed.filter(item => item.lost_location?.includes(localCity)).length;

  const enableLocalLocation = () => {
    setLocationEnabled(true);
    setLocalCity('成都');
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] px-4 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text)]">演示案例池</h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            {useDemoFeed ? '当前展示内置案例，保证面试现场不空屏' : '来自当前演示数据'}
          </p>
        </div>
        {error && (
          <button
            onClick={() => { setLoading(true); fetchItems(1, false); }}
            className="text-xs font-medium text-[var(--color-primary)]"
          >
            重试接口
          </button>
        )}
      </div>

      <div className="mb-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-2 shadow-sm">
        <div className="grid grid-cols-2 rounded-xl bg-[var(--color-bg-secondary)] p-1">
          <button
            onClick={() => setScope('local')}
            className={`rounded-lg py-2 text-sm font-medium transition-colors ${
              scope === 'local'
                ? 'bg-[var(--color-bg-card)] text-[var(--color-primary)] shadow-sm'
                : 'text-[var(--color-text-secondary)]'
            }`}
          >
            本地
          </button>
          <button
            onClick={() => setScope('all')}
            className={`rounded-lg py-2 text-sm font-medium transition-colors ${
              scope === 'all'
                ? 'bg-[var(--color-bg-card)] text-[var(--color-primary)] shadow-sm'
                : 'text-[var(--color-text-secondary)]'
            }`}
          >
            全部区域
          </button>
        </div>

        {scope === 'local' && (
          <div className="mt-3 flex items-center justify-between gap-3 px-1 pb-1">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--color-text)]">
                {locationEnabled ? `已定位：${localCity}` : '开启定位，优先看附近线索'}
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                {locationEnabled
                  ? `自动匹配到 ${localCount} 条本地寻人线索`
                  : '演示版使用 Mock 定位，不会调用真实权限'}
              </p>
            </div>
            <button
              onClick={enableLocalLocation}
              className="shrink-0 rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-xs font-medium text-white disabled:bg-[var(--color-bg-secondary)] disabled:text-[var(--color-text-muted)]"
              disabled={locationEnabled}
            >
              {locationEnabled ? '已开启' : '开启定位'}
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="mb-3 overflow-hidden rounded-xl bg-[var(--color-bg-card)]">
              <div className="aspect-[4/3] w-full animate-pulse bg-[var(--color-bg-secondary)]" />
              <div className="space-y-2 p-3">
                <div className="h-3 w-3/4 animate-pulse rounded bg-[var(--color-bg-secondary)]" />
                <div className="h-2 w-1/2 animate-pulse rounded bg-[var(--color-bg-secondary)]" />
                <div className="h-2 w-2/3 animate-pulse rounded bg-[var(--color-bg-secondary)]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 pb-24">
          {feed.length === 0 && (
            <div className="col-span-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 text-center">
              <p className="text-sm font-medium text-[var(--color-text)]">本地暂无线索</p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                可以切换到全部区域，或发布一条新的寻人线索。
              </p>
            </div>
          )}
          {feed.map((item, idx) => (
            <div key={item.id} className={`animate-fade-in-up delay-${Math.min((idx % 4) * 100, 400)}`}>
              <MissingCard
                id={item.id}
                title={item.title}
                photos={item.photos}
                targetName={item.target_name}
                lostLocation={item.lost_location}
                lostType={item.lost_type}
                lostTime={item.lost_time}
                description={item.description}
                viewCount={item.view_count}
                matchCount={item.match_count}
                createdAt={item.created_at}
              />
            </div>
          ))}
          <div ref={sentinelRef} className="h-4" />
          {loadingMore && (
            <div className="py-4 text-center text-sm text-[var(--color-text-muted)]">
              加载中...
            </div>
          )}
          {!hasMore && items.length > 0 && (
            <div className="py-4 text-center text-sm text-[var(--color-text-muted)]">
              已加载全部
            </div>
          )}
        </div>
      )}
    </div>
  );
}

