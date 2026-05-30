import type { MockKeywordItem } from '../../services/ai-mock';

interface Props {
  rawText: string;
  keywords: MockKeywordItem[];
}

const typeLabels: Record<string, string> = {
  person: '姓名',
  location: '地点',
  time: '时间',
  contact: '联系方式',
  other: '线索',
};

const typeColors: Record<string, string> = {
  person: 'bg-amber-100 text-amber-800 border-amber-200',
  location: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  time: 'bg-blue-100 text-blue-800 border-blue-200',
  contact: 'bg-purple-100 text-purple-800 border-purple-200',
  other: 'bg-stone-100 text-stone-700 border-stone-200',
};

export default function OCRResult({ rawText, keywords }: Props) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 text-sm font-medium text-[var(--color-text)]">整理出的线索</h3>
      <div className="mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text)]">
          {rawText}
        </p>
      </div>

      <h3 className="mb-2 text-sm font-medium text-[var(--color-text)]">可用于填写的信息</h3>
      {keywords.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw, i) => (
            <span
              key={`${kw.value}-${i}`}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${typeColors[kw.type] || typeColors.other}`}
            >
              <span className="opacity-70">{typeLabels[kw.type]}</span>
              <span className="font-medium">{kw.value}</span>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-muted)]">暂未整理出明确线索</p>
      )}
    </div>
  );
}
