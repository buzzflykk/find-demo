interface Props {
  score: number;
  clues: {
    timeMatch: boolean;
    locationMatch: boolean;
    nameMatch: boolean;
    keywordMatches: string[];
  };
  source: {
    targetName: string;
    lostTime: string;
    lostLocation: string;
    description: string;
  };
  matched: {
    targetName: string;
    lostTime: string;
    lostLocation: string;
    description: string;
  };
}

function ClueRow({
  label, matched, sourceValue, matchedValue,
}: {
  label: string;
  matched: boolean;
  sourceValue: string;
  matchedValue: string;
}) {
  return (
    <div className={`rounded-lg border p-3 ${matched ? 'border-amber-200 bg-amber-50/50' : 'border-gray-100 bg-gray-50/50'}`}>
      <div className="mb-1.5 flex items-center gap-2">
        <span className={`text-xs font-medium ${matched ? 'text-amber-700' : 'text-gray-400'}`}>
          {label}
        </span>
        {matched && (
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">匹配</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="truncate text-[var(--color-text)]">{sourceValue || '—'}</div>
        <div className={`truncate ${matched ? 'text-amber-800' : 'text-[var(--color-text-secondary)]'}`}>
          {matchedValue || '—'}
        </div>
      </div>
    </div>
  );
}

export default function ClueComparison({ score, clues, source, matched }: Props) {
  return (
    <div>
      {/* 匹配度大标题 */}
      <div className="mb-6 text-center">
        <div className="mb-1 text-4xl font-bold text-amber-600">{score}%</div>
        <p className="text-sm text-[var(--color-text-secondary)]">匹配度</p>
        <p className="mt-1 text-sm font-medium text-amber-700">你可能找到了线索！</p>
      </div>

      {/* 线索对比 */}
      <div className="space-y-2">
        <ClueRow
          label="寻找对象"
          matched={clues.nameMatch}
          sourceValue={source.targetName || '未填写'}
          matchedValue={matched.targetName || '未填写'}
        />
        <ClueRow
          label="失联时间"
          matched={clues.timeMatch}
          sourceValue={source.lostTime || '未填写'}
          matchedValue={matched.lostTime || '未填写'}
        />
        <ClueRow
          label="失联地点"
          matched={clues.locationMatch}
          sourceValue={source.lostLocation || '未填写'}
          matchedValue={matched.lostLocation || '未填写'}
        />
      </div>

      {/* 关键词匹配 */}
      {clues.keywordMatches.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2 text-xs font-medium text-[var(--color-text-secondary)]">共同关键词</h4>
          <div className="flex flex-wrap gap-1.5">
            {clues.keywordMatches.map((kw, i) => (
              <span key={i} className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs text-amber-700">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
