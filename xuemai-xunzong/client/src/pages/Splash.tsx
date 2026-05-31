import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const productSteps = [
  { title: '线索输入', desc: '照片 / 信件 / 文字描述 / 宠物走失' },
  { title: '信息整理', desc: '补全姓名、地点、时间和场景' },
  { title: '分享转化', desc: '生成分享卡，方便转发扩散' },
  { title: '线索反馈', desc: '公共池展示，私聊补充线索' },
];

const metrics = [
  { label: '核心路径', value: '6 步' },
  { label: '场景线索', value: '5 类' },
  { label: 'MVP 边界', value: 'Mock' },
];

export default function Splash() {
  const navigate = useNavigate();
  const { user, login, loading } = useAuth();
  const [entering, setEntering] = useState(false);
  const [error, setError] = useState('');

  const enterApp = async () => {
    if (entering || loading) return;
    setEntering(true);
    setError('');
    try {
      if (!user) {
        await login('13800000000', '123456');
      }
      navigate('/home', { replace: true });
    } catch (err: any) {
      setError(err.message || '演示版进入失败，请确认服务已启动');
      setEntering(false);
    }
  };

  return (
    <button
      type="button"
      onClick={enterApp}
      className="relative flex min-h-full w-full flex-col overflow-hidden bg-[var(--color-bg)] px-5 pb-8 pt-6 text-left text-[var(--color-text)]"
      aria-label="进入时光印记演示 App"
    >
      <div className="pointer-events-none absolute -right-20 top-16 h-48 w-48 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-4 h-56 w-56 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
              DEMO
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[var(--color-brand)]">时光印记</h1>
          </div>
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)]">
            展示机模式
          </span>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-xs font-medium text-[var(--color-primary)]">C 端 Demo</p>
          <h2 className="text-[28px] font-bold leading-tight text-[var(--color-text)]">
            把模糊记忆
            <br />
            变成可传播线索
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
            面向想找回旧友、同学、邻居，以及寻找宠物猫狗的用户，把零散照片、文字描述和地点记忆整理成可发布、可传播、可反馈的线索。
          </p>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2">
          {metrics.map(metric => (
            <div
              key={metric.label}
              className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] px-2 py-3 text-center shadow-sm"
            >
              <p className="text-xl font-bold text-[var(--color-text)]">{metric.value}</p>
              <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{metric.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {productSteps.map((step, index) => (
            <div key={step.title} className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text)]">{step.title}</p>
                <p className="truncate text-xs text-[var(--color-text-muted)]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-8 text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-sm">
            <span className="flex h-full items-center justify-center text-xl text-[var(--color-primary)]">›</span>
          </div>
          <p className="text-sm font-medium text-[var(--color-text)]">
            {entering ? '正在进入演示 App...' : '轻点屏幕任意位置开始体验'}
          </p>
          {error && (
            <p className="mt-3 rounded-lg bg-[var(--color-error)]/10 px-3 py-2 text-xs text-[var(--color-error)]">
              {error}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
