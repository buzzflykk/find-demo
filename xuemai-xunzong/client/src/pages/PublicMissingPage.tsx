import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function PublicMissingPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.getPublicMissing(id)
      .then(setItem)
      .catch(() => setError('未找到该寻人信息'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[var(--color-bg)]">
        <p className="text-sm text-[var(--color-text-muted)]">加载中...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-[var(--color-bg)] px-4 text-center">
        <div className="mb-4 text-6xl opacity-60">🔍</div>
        <h1 className="mb-2 text-lg font-medium text-[var(--color-text)]">未找到</h1>
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">{error || '该寻人信息不存在或已下架'}</p>
        <a
          href={window.location.origin}
          className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm text-white"
        >
          回到首页
        </a>
      </div>
    );
  }

  const photos: string[] = typeof item.photos === 'string' ? JSON.parse(item.photos) : item.photos || [];

  return (
    <div className="min-h-full bg-[var(--color-bg)]">
      {/* 简洁顶部条 */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3">
        <span className="text-sm font-medium text-[var(--color-text)]">线索详情</span>
        <a
          href={window.location.origin}
          className="text-xs text-[var(--color-primary)]"
        >
          打开 App
        </a>
      </div>

      <div className="mx-auto max-w-lg px-4 pt-4 pb-8">
        {/* 照片 */}
        {photos.length > 0 && (
          <div className="mb-4 overflow-hidden rounded-xl">
            <img src={photos[0]} alt="寻人照片" className="w-full object-cover" />
          </div>
        )}

        {/* 标题 */}
        <h1 className="mb-3 text-xl font-bold text-[var(--color-text)]">
          {item.title}
        </h1>

        {/* 状态 */}
        {item.status === 'found' ? (
          <span className="mb-3 inline-block rounded-full bg-emerald-500 px-3 py-0.5 text-xs text-white">
            已找到
          </span>
        ) : (
          <span className="mb-3 inline-block rounded-full bg-amber-500 px-3 py-0.5 text-xs text-white">
            寻人中
          </span>
        )}

        {/* 信息 */}
        <div className="mb-4 space-y-2 text-sm text-[var(--color-text-secondary)]">
          {item.target_name && <p>目标姓名：{item.target_name}</p>}
          {item.target_nickname && <p>昵称/别名：{item.target_nickname}</p>}
          {item.lost_time && <p>失联时间：{item.lost_time}</p>}
          {item.lost_location && <p>失联地点：{item.lost_location}</p>}
          {item.lost_type && <p>失联类型：{item.lost_type}</p>}
        </div>

        {/* 描述 */}
        {item.description && (
          <div className="mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
            <h3 className="mb-2 text-sm font-medium text-[var(--color-text)]">描述</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {item.description}
            </p>
          </div>
        )}

        {/* AI 关键词 */}
        {item.ai_keywords?.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-medium text-[var(--color-text)]">关键线索</h3>
            <div className="flex flex-wrap gap-2">
              {item.ai_keywords.map((kw: any, i: number) => (
                <span
                  key={i}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)]"
                >
                  {kw.value || kw.label || kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 统计 */}
        <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
          <span>{item.view_count || 0} 次浏览</span>
          <span>{item.match_count || 0} 个匹配</span>
          <span>{item.created_at ? new Date(item.created_at).toLocaleDateString('zh-CN') : ''} 发布</span>
        </div>

        {/* 底部引导 */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="mb-1 text-sm font-medium text-amber-800">有线索？</p>
          <p className="mb-3 text-xs text-amber-600">如果你认识这个人，欢迎到时光印记 App 联系发布者</p>
          <a
            href={window.location.origin}
            className="inline-block rounded-lg bg-amber-500 px-6 py-2 text-sm text-white"
          >
            打开时光印记
          </a>
        </div>
      </div>
    </div>
  );
}
