import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import ClueComparison from '../components/match/ClueComparison';

interface MatchItem {
  missingPersonId: string;
  matchedPersonId: string;
  score: number;
  clues: {
    timeMatch: boolean;
    locationMatch: boolean;
    nameMatch: boolean;
    keywordMatches: string[];
  };
  matchedPerson: {
    id: string;
    title: string;
    photos: string[];
    target_name: string;
    lost_time: string;
    lost_location: string;
    description: string;
    user_id: string;
  };
}

export default function MatchResult() {
  const { missingPersonId } = useParams<{ missingPersonId: string }>();
  const nav = useNavigate();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceData, setSourceData] = useState<any>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    if (!missingPersonId) return;
    (async () => {
      try {
        const [matchData, detail] = await Promise.all([
          api.getMatchResults(missingPersonId),
          api.getMissingDetail(missingPersonId),
        ]);
        setMatches(matchData.matches);
        setSourceData(detail);
      } finally {
        setLoading(false);
      }
    })();
  }, [missingPersonId]);

  const handleConfirm = async (matchedPersonId: string, matchedUserId: string) => {
    setConfirmingId(matchedPersonId);
    try {
      await api.confirmMatch(matchedPersonId, missingPersonId!);
      // 跳转到私信
      nav(`/chat/${missingPersonId}/${matchedUserId}`);
    } finally {
      setConfirmingId(null);
    }
  };

  const handleMarkFound = async () => {
    if (!missingPersonId) return;
    try {
      await api.markFound(missingPersonId);
      nav(-1);
    } catch {
      // silent
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-24 text-sm text-[var(--color-text-muted)]">
        正在分析匹配结果...
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* 顶部 */}
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3">
        <button onClick={() => nav(-1)} className="text-sm text-[var(--color-text-muted)]">← 返回</button>
        <span className="text-sm font-medium text-[var(--color-text)]">匹配结果</span>
      </div>

      <div className="px-4 pt-4">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16 text-center">
            <div className="mb-4 text-6xl opacity-60">🔍</div>
            <h2 className="mb-2 text-lg font-medium text-[var(--color-text)]">暂未发现匹配</h2>
            <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
              当前公共池中暂无高度匹配的寻人信息，稍后再来看看
            </p>
            {sourceData?.status === 'active' && (
              <button
                onClick={handleMarkFound}
                className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-secondary)]"
              >
                标记为已找到
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-[var(--color-text-secondary)]">
              发现 <span className="font-medium text-[var(--color-text)]">{matches.length}</span> 条可能的匹配线索
            </p>
            {matches.map((m, i) => (
              <div key={m.matchedPersonId} className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 card-shadow animate-fade-in-up delay-${Math.min(i * 100, 400)}`}>
                {/* 匹配头部 */}
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--color-bg-secondary)]">
                    {m.matchedPerson?.photos?.[0] ? (
                      <img src={m.matchedPerson.photos[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xl text-[var(--color-text-muted)]">👤</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-[var(--color-text)]">
                      {m.matchedPerson?.title || '未命名寻人'}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)]">发布者 ID: {m.matchedPerson?.user_id?.substring(0, 8)}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-amber-600">{m.score}%</div>
                    <p className="text-[10px] text-[var(--color-text-muted)]">匹配度</p>
                  </div>
                </div>

                {/* 线索对比 */}
                <ClueComparison
                  score={m.score}
                  clues={m.clues}
                  source={{
                    targetName: sourceData?.target_name || '',
                    lostTime: sourceData?.lost_time || '',
                    lostLocation: sourceData?.lost_location || '',
                    description: sourceData?.description || '',
                  }}
                  matched={{
                    targetName: m.matchedPerson?.target_name || '',
                    lostTime: m.matchedPerson?.lost_time || '',
                    lostLocation: m.matchedPerson?.lost_location || '',
                    description: m.matchedPerson?.description || '',
                  }}
                />

                {/* 操作按钮 */}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleConfirm(m.matchedPersonId, m.matchedPerson.user_id)}
                    disabled={confirmingId === m.matchedPersonId}
                    className="flex-1 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand)] disabled:opacity-50"
                  >
                    {confirmingId === m.matchedPersonId ? '确认中...' : '发起私信'}
                  </button>
                  <button
                    onClick={() => nav(`/missing/${m.matchedPersonId}`)}
                    className="flex-1 rounded-lg border border-[var(--color-border)] py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)]"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            ))}

            {/* 标记已找到 */}
            {sourceData?.status === 'active' && (
              <div className="pt-2 text-center">
                <button
                  onClick={handleMarkFound}
                  className="text-xs text-[var(--color-text-muted)] underline hover:text-[var(--color-text-secondary)]"
                >
                  已经找到了？标记为已找到
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
