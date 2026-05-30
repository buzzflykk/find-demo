import { useState } from 'react';
import { useDesign, type DesignParams } from './DesignContext';

type SectionKey = 'shell' | 'background' | 'statusbar' | 'notch' | 'content' | 'homeIndicator';

const sections: { key: SectionKey; label: string }[] = [
  { key: 'shell', label: '📱 手机壳' },
  { key: 'background', label: '🎨 背景' },
  { key: 'statusbar', label: '📊 状态栏' },
  { key: 'notch', label: '✂️ 刘海' },
  { key: 'content', label: '📄 内容区' },
  { key: 'homeIndicator', label: '🏠 Home Indicator' },
];

export default function DesignPanel() {
  const { params, update, reset } = useDesign();
  const [collapsed, setCollapsed] = useState<Set<SectionKey>>(new Set(['homeIndicator']));
  const [panelOpen, setPanelOpen] = useState(true);

  const toggle = (key: SectionKey) => {
    const next = new Set(collapsed);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setCollapsed(next);
  };

  if (!panelOpen) {
    return (
      <button
        onClick={() => setPanelOpen(true)}
        className="fixed right-3 top-3 z-[99999] cursor-pointer rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-gray-800 shadow-lg hover:bg-white"
      >
        ⚙ 显示控制面板
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-0 z-[99999] flex h-screen w-[300px] flex-col bg-white/95 shadow-[-4px_0_24px_rgba(0,0,0,0.12)] backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-bold text-gray-800">设计调试面板</h2>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="cursor-pointer rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100">
            重置
          </button>
          <button onClick={() => setPanelOpen(false)} className="cursor-pointer rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100">
            ✕
          </button>
        </div>
      </div>

      {/* 全局缩放控制 — 始终可见 */}
      <div className="border-b border-gray-200 px-4 py-2">
        <Slider label="全局缩放" value={params.contentScale} min={50} max={150} step={1} unit="%" onChange={(v) => update('contentScale', v)} />
      </div>

      {/* Controls */}
      <div className="flex-1 overflow-y-auto px-4 py-3 text-xs">
        {sections.map((sec) => (
          <div key={sec.key} className="mb-2">
            <button
              onClick={() => toggle(sec.key)}
              className="flex w-full cursor-pointer items-center justify-between rounded px-2 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              {sec.label}
              <span className="text-gray-400">{collapsed.has(sec.key) ? '▶' : '▼'}</span>
            </button>
            {!collapsed.has(sec.key) && (
              <div className="space-y-2 pl-2 pt-1">
                <Controls section={sec.key} params={params} update={update} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="border-t border-gray-200 px-4 py-2 text-[10px] text-gray-400">
        调整数值实时生效 · 不影响原始页面
      </div>
    </div>
  );
}

/* ─── per-section control groups ─── */

function Controls({
  section,
  params,
  update,
}: {
  section: SectionKey;
  params: DesignParams;
  update: (k: keyof DesignParams, v: number | string | boolean) => void;
}) {
  switch (section) {
    case 'shell':
      return (
        <>
          <Slider label="宽度" value={params.phoneWidth} min={280} max={500} step={1} unit="px" onChange={(v) => update('phoneWidth', v)} />
          <Slider label="高度" value={params.phoneHeight} min={600} max={1100} step={1} unit="px" onChange={(v) => update('phoneHeight', v)} />
          <Slider label="圆角" value={params.phoneBorderRadius} min={0} max={60} step={1} unit="px" onChange={(v) => update('phoneBorderRadius', v)} />
          <Slider label="边框粗细" value={params.phoneBorderWidth} min={0} max={20} step={1} unit="px" onChange={(v) => update('phoneBorderWidth', v)} />
          <ColorPicker label="边框颜色" value={params.phoneBorderColor} onChange={(v) => update('phoneBorderColor', v)} />
          <Slider label="阴影强度" value={params.shadowIntensity} min={0} max={200} step={1} unit="px" onChange={(v) => update('shadowIntensity', v)} />
        </>
      );
    case 'background':
      return (
        <>
          <ColorPicker label="渐变起始色" value={params.bgGradientFrom} onChange={(v) => update('bgGradientFrom', v)} />
          <ColorPicker label="渐变色" value={params.bgGradientVia} onChange={(v) => update('bgGradientVia', v)} />
          <ColorPicker label="渐变终止色" value={params.bgGradientTo} onChange={(v) => update('bgGradientTo', v)} />
          <Slider label="环境光晕大小" value={params.ambientGlowSize} min={200} max={1000} step={10} unit="px" onChange={(v) => update('ambientGlowSize', v)} />
          <Slider label="环境光晕透明度" value={params.ambientGlowOpacity} min={0} max={30} step={1} unit="%" onChange={(v) => update('ambientGlowOpacity', v)} />
          <ColorPicker label="环境光晕颜色" value={params.ambientGlowColor} onChange={(v) => update('ambientGlowColor', v)} />
          <Slider label="纸张纹理透明度" value={params.paperOpacity} min={0} max={20} step={1} unit="%" onChange={(v) => update('paperOpacity', v)} />
        </>
      );
    case 'statusbar':
      return (
        <>
          <Slider label="状态栏高度" value={params.statusBarHeight} min={30} max={80} step={1} unit="px" onChange={(v) => update('statusBarHeight', v)} />
          <Slider label="字号" value={params.statusBarFontSize} min={10} max={20} step={1} unit="px" onChange={(v) => update('statusBarFontSize', v)} />
          <Slider label="透明度" value={params.statusBarOpacity} min={30} max={100} step={1} unit="%" onChange={(v) => update('statusBarOpacity', v)} />
          <Toggle label="信号图标" checked={params.showSignal} onChange={(v) => update('showSignal', v)} />
          <Toggle label="WiFi 图标" checked={params.showWifi} onChange={(v) => update('showWifi', v)} />
          <Toggle label="电池图标" checked={params.showBattery} onChange={(v) => update('showBattery', v)} />
          <div className="grid grid-cols-2 gap-2">
            <Slider label="时" value={params.timeHours} min={0} max={23} step={1} unit="h" onChange={(v) => update('timeHours', v)} />
            <Slider label="分" value={params.timeMinutes} min={0} max={59} step={1} unit="m" onChange={(v) => update('timeMinutes', v)} />
          </div>
        </>
      );
    case 'notch':
      return (
        <>
          <Toggle label="显示刘海" checked={params.showNotch} onChange={(v) => update('showNotch', v)} />
          <Slider label="刘海宽度" value={params.notchWidth} min={60} max={280} step={1} unit="px" onChange={(v) => update('notchWidth', v)} />
          <Slider label="刘海高度" value={params.notchHeight} min={10} max={50} step={1} unit="px" onChange={(v) => update('notchHeight', v)} />
        </>
      );
    case 'content':
      return (
        <>
          <Slider label="内容区高度" value={params.contentAreaHeight} min={500} max={900} step={1} unit="px" onChange={(v) => update('contentAreaHeight', v)} />
        </>
      );
    case 'homeIndicator':
      return (
        <>
          <Toggle label="显示 Home Indicator" checked={params.showHomeIndicator} onChange={(v) => update('showHomeIndicator', v)} />
          <Slider label="指示条宽度" value={params.homeIndicatorWidth} min={40} max={200} step={1} unit="px" onChange={(v) => update('homeIndicatorWidth', v)} />
          <Slider label="指示条区域高度" value={params.homeIndicatorHeight} min={10} max={50} step={1} unit="px" onChange={(v) => update('homeIndicatorHeight', v)} />
        </>
      );
  }
}

/* ─── reusable input components ─── */

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-gray-600">{label}</span>
      <div className="relative flex-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[#8B6914]"
          style={{
            background: `linear-gradient(to right, #8B6914 0%, #8B6914 ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`,
          }}
        />
      </div>
      <span className="w-14 shrink-0 text-right text-[10px] text-gray-500">
        {value}{unit}
      </span>
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-gray-600">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-6 w-8 cursor-pointer rounded border border-gray-300"
      />
      <span className="text-[10px] text-gray-400">{value}</span>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <span className="w-20 shrink-0 text-gray-600">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 cursor-pointer rounded accent-[#8B6914]"
      />
    </label>
  );
}
