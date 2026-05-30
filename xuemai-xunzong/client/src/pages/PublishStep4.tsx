import { useEffect, useState } from 'react';

interface Props {
  initial: {
    targetName: string;
    targetNickname: string;
    lostTime: string;
    lostLocation: string;
    lostType: string;
    description: string;
  };
  onSave: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const clueScenarios = [
  '旧友失联',
  '宠物狗走失',
  '老同学',
  '旧信件线索',
  '搬家失联',
  '儿时玩伴',
  '老邻居',
  '其他',
];

export default function PublishStep4({ initial, onSave, onNext, onPrev }: Props) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const handleChange = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleNext = () => {
    onSave(form);
    onNext();
  };

  return (
    <div className="space-y-4 px-4 pb-24 pt-2">
      <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
        请确认关键信息。系统已根据上传内容预填一部分，用户可以继续修改。
      </p>

      <div>
        <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">目标姓名</label>
        <input
          type="text"
          placeholder="如：李明"
          value={form.targetName}
          onChange={e => handleChange('targetName', e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">昵称 / 小名</label>
        <input
          type="text"
          placeholder="如：小明、阿花"
          value={form.targetNickname}
          onChange={e => handleChange('targetNickname', e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">失联时间</label>
        <input
          type="text"
          placeholder="如：2005 年夏天"
          value={form.lostTime}
          onChange={e => handleChange('lostTime', e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">失联地点</label>
        <input
          type="text"
          placeholder="如：成都武侯区"
          value={form.lostLocation}
          onChange={e => handleChange('lostLocation', e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">线索场景</label>
        <div className="flex flex-wrap gap-2">
          {clueScenarios.map(t => (
            <button
              key={t}
              onClick={() => handleChange('lostType', t)}
              className={`h-[28px] rounded-full border px-3.5 text-[12px] font-medium leading-[26px] transition-colors ${
                form.lostType === t
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">补充描述</label>
        <textarea
          placeholder="补充更多细节：共同经历、可能去向、最后一次联系..."
          value={form.description}
          onChange={e => handleChange('description', e.target.value)}
          rows={3}
          className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
        />
      </div>

      <div className="sticky bottom-0 z-30 -mx-4 flex gap-3 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3">
        <button
          onClick={onPrev}
          className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] py-2.5 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-secondary)]"
        >
          上一步
        </button>
        <button
          onClick={handleNext}
          className="flex-1 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand)]"
        >
          下一步：生成分享卡
        </button>
      </div>
    </div>
  );
}
