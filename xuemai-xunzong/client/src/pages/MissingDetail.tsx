import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { shareViaWebAPI, copyLink, getShareUrl } from '../services/share';
import { findDemoMissingById } from '../services/demoDataStore';

export default function MissingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shareMenu, setShareMenu] = useState(false);
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    api.getMissingDetail(id)
      .then(setItem)
      .catch(() => setItem(findDemoMissingById(id)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = async (type: 'link' | 'native') => {
    if (!id) return;
    const url = getShareUrl(id);

    if (type === 'link') {
      const ok = await copyLink(url);
      setShareMsg(ok ? '链接已复制' : '复制失败');
    } else if (type === 'native') {
      const ok = await shareViaWebAPI({
        title: item?.title || '寻人',
        text: `帮转：${item?.title || '寻人'} - 时光印记`,
        url,
      });
      if (!ok) {
        // 降级到复制链接
        await copyLink(url);
        setShareMsg('链接已复制');
      }
    }
    setShareMenu(false);
    setTimeout(() => setShareMsg(''), 3000);
  };

  const handleProvideClue = () => {
    if (!id) return;
    const publisherId = item?.user_id || item?.userId || 'demo-publisher';
    navigate(`/chat/${id}/${publisherId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-20 text-sm text-[var(--color-text-muted)]">
        加载中...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <p className="text-[var(--color-text-muted)]">未找到寻人信息</p>
        <button onClick={() => navigate('/home')} className="mt-4 text-sm text-[var(--color-primary)]">
          返回首页
        </button>
      </div>
    );
  }

  const photos: string[] = typeof item.photos === 'string' ? JSON.parse(item.photos) : item.photos || [];
  const keywords = Array.isArray(item.ai_keywords) ? item.ai_keywords : [];
  const keywordLabels = keywords
    .map((kw: any) => typeof kw === 'string' ? kw : kw?.value || kw?.text || kw?.label)
    .filter(Boolean);
  const hasPhoto = photos.length > 0;

  return (
    <div className="relative min-h-full px-4 pb-28 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-sm text-[var(--color-text-muted)]">
          ← 返回
        </button>
        {/* 分享按钮 */}
        <div className="relative">
          <button
            onClick={() => setShareMenu(!shareMenu)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)]"
          >
            分享
          </button>
          {shareMenu && (
            <>
              <div className="absolute inset-0 z-40" onClick={() => setShareMenu(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] py-1 shadow-lg">
                <button onClick={() => handleShare('link')} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]">
                  🔗 复制链接
                </button>
                <button onClick={() => handleShare('native')} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]">
                  📤 更多方式
                </button>
              </div>
            </>
          )}
          {shareMsg && (
            <span className="absolute -bottom-6 right-0 whitespace-nowrap text-xs text-[var(--color-primary)]">
              {shareMsg}
            </span>
          )}
        </div>
      </div>

      {/* 照片 */}
      {photos.length > 0 && (
        <div className="mb-4 overflow-hidden rounded-xl">
          <img src={photos[0]} alt="寻人照片" className="w-full object-cover" />
        </div>
      )}

      {/* 标题 */}
      <h1 className="mb-2 text-xl font-bold text-[var(--color-text)]">
        {item.title}
      </h1>

      {item.status === 'found' && (
        <span className="mb-3 inline-block rounded-full bg-[var(--color-success)] px-3 py-0.5 text-xs text-white">
          已找到
        </span>
      )}

      <div className="mb-4 grid grid-cols-2 gap-2">
        {[
          ['目标姓名', item.target_name || '待确认'],
          ['昵称/别名', item.target_nickname || '未填写'],
          ['失联时间', item.lost_time || '待补充'],
          ['失联地点', item.lost_location || '待补充'],
          ['失联类型', item.lost_type || '未分类'],
          ['线索来源', hasPhoto ? '照片/图文' : '纯文字线索'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3">
            <p className="text-[11px] text-[var(--color-text-muted)]">{label}</p>
            <p className="mt-1 text-sm font-medium text-[var(--color-text)]">{value}</p>
          </div>
        ))}
      </div>

      {item.description && (
        <div className="mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
          <h3 className="mb-2 text-sm font-medium text-[var(--color-text)]">线索描述</h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {item.description}
          </p>
        </div>
      )}

      <div className="mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-[var(--color-text)]">AI 结构化线索</h3>
          <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[11px] text-[var(--color-primary)]">
            用于匹配
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(keywordLabels.length > 0 ? keywordLabels : [item.lost_time, item.lost_location, item.lost_type, item.target_name])
            .filter(Boolean)
            .map((tag: string) => (
              <span key={tag} className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)]">
                {tag}
              </span>
            ))}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
        <span>{new Date(item.created_at).toLocaleDateString('zh-CN')} 发布</span>
      </div>

      <div className="mb-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
        <h3 className="mb-2 text-sm font-medium text-[var(--color-text)]">可以怎么帮忙</h3>
        <ul className="space-y-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          <li>如果你认识相关地点或人物，可以复制链接转发给可能知情的人。</li>
          <li>如果你有相似时间、地点或姓名线索，可以在公共池继续搜索匹配。</li>
          <li>当前信息不会以海报形式干扰阅读，详情页优先保证线索可读性。</li>
        </ul>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 px-4 py-3 backdrop-blur">
        <div className="flex gap-3">
          <button
            onClick={() => handleShare('link')}
            className="h-11 flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)]"
          >
            分享扩散
          </button>
          <button
            onClick={handleProvideClue}
            className="h-11 flex-[1.35] rounded-xl bg-[var(--color-accent)] text-sm font-semibold text-white shadow-md transition-colors hover:bg-[var(--color-accent-light)]"
          >
            私聊提供线索
          </button>
        </div>
      </div>
    </div>
  );
}

