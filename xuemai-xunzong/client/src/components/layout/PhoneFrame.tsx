import { useState, useEffect, useContext, createContext, type ReactNode } from 'react';

export interface PhoneParams {
  phoneWidth: number;
  phoneHeight: number;
  phoneBorderRadius: number;
  phoneBorderWidth: number;
  phoneBorderColor: string;
  shadowIntensity: number;
  bgGradientFrom: string;
  bgGradientVia: string;
  bgGradientTo: string;
  ambientGlowSize: number;
  ambientGlowOpacity: number;
  ambientGlowColor: string;
  paperOpacity: number;
  statusBarHeight: number;
  statusBarFontSize: number;
  statusBarOpacity: number;
  showSignal: boolean;
  showWifi: boolean;
  showBattery: boolean;
  timeHours: number;
  timeMinutes: number;
  notchWidth: number;
  notchHeight: number;
  showNotch: boolean;
  contentAreaHeight: number;
  homeIndicatorWidth: number;
  homeIndicatorHeight: number;
  showHomeIndicator: boolean;
  contentScale: number;
}

const DEFAULTS: PhoneParams = {
  phoneWidth: 393,
  phoneHeight: 852,
  phoneBorderRadius: 58,
  phoneBorderWidth: 8,
  phoneBorderColor: '#3f4653',
  shadowIntensity: 110,
  bgGradientFrom: '#080d18',
  bgGradientVia: '#111827',
  bgGradientTo: '#050914',
  ambientGlowSize: 720,
  ambientGlowOpacity: 8,
  ambientGlowColor: '#d4a843',
  paperOpacity: 2,
  statusBarHeight: 58,
  statusBarFontSize: 14,
  statusBarOpacity: 88,
  showSignal: true,
  showWifi: true,
  showBattery: true,
  timeHours: 9,
  timeMinutes: 41,
  notchWidth: 118,
  notchHeight: 34,
  showNotch: true,
  contentAreaHeight: 742,
  homeIndicatorWidth: 124,
  homeIndicatorHeight: 30,
  showHomeIndicator: true,
  contentScale: 100,
};
const PhoneParamsCtx = createContext<PhoneParams>(DEFAULTS);

/** Allow DebugProvider (or any caller) to inject design-time overrides */
export function PhoneParamsProvider({
  overrides,
  children,
}: {
  overrides: Partial<PhoneParams>;
  children: ReactNode;
}) {
  return (
    <PhoneParamsCtx.Provider value={{ ...DEFAULTS, ...overrides }}>
      {children}
    </PhoneParamsCtx.Provider>
  );
}

export default function PhoneFrame({ children }: { children: ReactNode }) {
  const p = useContext(PhoneParamsCtx);

  const [time, setTime] = useState(new Date());
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 30000);
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // 自定义时间 vs 实时时间
  const showCustomTime =
    p.timeHours !== DEFAULTS.timeHours || p.timeMinutes !== DEFAULTS.timeMinutes;
  const displayTime = showCustomTime
    ? `${String(p.timeHours).padStart(2, '0')}:${String(p.timeMinutes).padStart(2, '0')}`
    : time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
  const frameScale = Math.min(
    (viewport.width - 40) / p.phoneWidth,
    (viewport.height - 40) / p.phoneHeight,
    1,
  );
  const screenInset = Math.max(p.phoneBorderWidth, 8);
  const screenRadius = Math.max(p.phoneBorderRadius - 12, 42);
  const screenHeight = p.phoneHeight - screenInset * 2;
  const contentHeight = screenHeight - p.statusBarHeight - p.homeIndicatorHeight;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden select-none"
      style={{
        background: `linear-gradient(to bottom, ${p.bgGradientFrom}, ${p.bgGradientVia}, ${p.bgGradientTo})`,
      }}
    >
      {/* 环境光晕 */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/4 -translate-x-1/2 rounded-full blur-3xl"
          style={{
            width: p.ambientGlowSize,
            height: p.ambientGlowSize,
            backgroundColor: p.ambientGlowColor,
            opacity: p.ambientGlowOpacity / 100,
          }}
        />
      </div>

      {/* iPhone 17 Pro Max 风格展示机 */}
      <div
        className="relative mx-auto overflow-visible"
        style={{
          width: p.phoneWidth,
          height: p.phoneHeight,
          borderRadius: p.phoneBorderRadius,
          background:
            'linear-gradient(145deg, #6b7280 0%, #1f2937 18%, #05070b 48%, #4b5563 100%)',
          boxShadow: `0 32px ${p.shadowIntensity}px rgba(0,0,0,0.72), 0 0 0 1px rgba(255,255,255,0.16), inset 0 0 0 1px rgba(255,255,255,0.16)`,
          transform: `scale(${frameScale})`,
          transformOrigin: 'center center',
        }}
      >
        <div className="pointer-events-none absolute -left-[3px] top-[154px] h-[92px] w-[4px] rounded-l-full bg-slate-500/80" />
        <div className="pointer-events-none absolute -right-[3px] top-[214px] h-[112px] w-[4px] rounded-r-full bg-slate-500/80" />
        <div
          className="absolute bg-black"
          style={{
            inset: screenInset,
            borderRadius: screenRadius,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        />
        <div
          className="absolute overflow-hidden bg-[var(--color-bg)]"
          style={{
            inset: screenInset + 2,
            borderRadius: screenRadius - 3,
          }}
        >
          {/* 纸张纹理 */}
          <div
            className="pointer-events-none absolute inset-0 z-[9999]"
            style={{
              opacity: p.paperOpacity / 100,
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
            }}
          />
          <div
            className="relative z-50 flex items-center justify-between px-7 font-semibold text-[var(--color-text)]"
            style={{
              height: p.statusBarHeight,
              fontSize: p.statusBarFontSize,
              opacity: p.statusBarOpacity / 100,
            }}
          >
            <span>{displayTime}</span>
            <div className="flex items-center gap-1.5">
              {p.showSignal && (
                <svg width="18" height="13" viewBox="0 0 18 13" className="fill-current">
                  <rect x="0" y="8" width="3" height="5" rx="0.7" />
                  <rect x="5" y="5.5" width="3" height="7.5" rx="0.7" />
                  <rect x="10" y="2.8" width="3" height="10.2" rx="0.7" />
                  <rect x="15" y="0" width="3" height="13" rx="0.7" />
                </svg>
              )}
              {p.showWifi && (
                <svg width="17" height="13" viewBox="0 0 17 13" className="fill-current">
                  <path d="M8.5 11.4a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zM5.5 7.9a4.5 4.5 0 0 1 6 0l-1.1 1.1a3 3 0 0 0-3.8 0L5.5 7.9zM2.9 5.2a8 8 0 0 1 11.2 0L13 6.3a6.45 6.45 0 0 0-9 0L2.9 5.2zM.4 2.5a11.5 11.5 0 0 1 16.2 0l-1.1 1.1a10 10 0 0 0-14 0L.4 2.5z" />
                </svg>
              )}
              {p.showBattery && (
                <div className="relative flex h-[11px] w-[25px] items-center rounded-[3px] border-[1.6px] border-current px-[2px]">
                  <div className="h-[5.5px] w-[16px] rounded-[1px] bg-current" />
                  <div className="absolute -right-[4px] top-1/2 h-[6px] w-[2.5px] -translate-y-1/2 rounded-r-[1.5px] border border-current bg-transparent" />
                </div>
              )}
            </div>
          </div>
          {p.showNotch && (
            <div
              className="absolute left-1/2 top-[11px] z-[80] -translate-x-1/2 rounded-full bg-black shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
              style={{ width: p.notchWidth, height: p.notchHeight }}
            >
              <div className="absolute right-[14px] top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-full bg-slate-800">
                <div className="absolute left-[3px] top-[3px] h-[3px] w-[3px] rounded-full bg-slate-500" />
              </div>
            </div>
          )}

          {/* 屏幕内容 - 独立滚动视口 */}
          <div
            className="overflow-hidden bg-[var(--color-bg)]"
            style={{
              height: contentHeight,
              scrollbarWidth: 'none',
            }}
          >
            <div
              className="relative"
              style={{
                height: contentHeight,
                isolation: 'isolate',
                transformOrigin: 'top center',
                transform: p.contentScale !== 100 ? `scale(${p.contentScale / 100})` : undefined,
              }}
            >
              {children}
            </div>
          </div>

          {/* Home Indicator */}
          {p.showHomeIndicator && (
            <div
              className="flex items-center justify-center bg-[var(--color-bg)]"
              style={{ height: p.homeIndicatorHeight }}
            >
              <div
                className="rounded-full bg-[var(--color-text)]/45"
                style={{ width: p.homeIndicatorWidth, height: 5 }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
