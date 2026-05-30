import { createContext, useContext, useState, type ReactNode } from 'react';

export interface DesignParams {
  // 手机壳
  phoneWidth: number;
  phoneHeight: number;
  phoneBorderRadius: number;
  phoneBorderWidth: number;
  phoneBorderColor: string;

  // 阴影
  shadowIntensity: number;

  // 背景
  bgGradientFrom: string;
  bgGradientVia: string;
  bgGradientTo: string;

  // 环境光晕
  ambientGlowSize: number;
  ambientGlowOpacity: number;
  ambientGlowColor: string;

  // 纸张纹理
  paperOpacity: number;

  // 状态栏
  statusBarHeight: number;
  statusBarFontSize: number;
  statusBarOpacity: number;
  showSignal: boolean;
  showWifi: boolean;
  showBattery: boolean;

  // 时间
  timeHours: number;
  timeMinutes: number;

  // 刘海
  notchWidth: number;
  notchHeight: number;
  showNotch: boolean;

  // 内容区
  contentAreaHeight: number;

  // Home Indicator
  homeIndicatorWidth: number;
  homeIndicatorHeight: number;
  showHomeIndicator: boolean;

  // 内部缩放
  contentScale: number;
}

const defaults: DesignParams = {
  phoneWidth: 393,
  phoneHeight: 852,
  phoneBorderRadius: 48,
  phoneBorderWidth: 6,
  phoneBorderColor: '#374151',

  shadowIntensity: 80,

  bgGradientFrom: '#111827',
  bgGradientVia: '#1f2937',
  bgGradientTo: '#111827',

  ambientGlowSize: 600,
  ambientGlowOpacity: 5,
  ambientGlowColor: '#f59e0b',

  paperOpacity: 3,

  statusBarHeight: 54,
  statusBarFontSize: 12,
  statusBarOpacity: 90,
  showSignal: true,
  showWifi: true,
  showBattery: true,

  timeHours: 9,
  timeMinutes: 41,

  notchWidth: 144,
  notchHeight: 24,
  showNotch: true,

  contentAreaHeight: 708,

  homeIndicatorWidth: 112,
  homeIndicatorHeight: 14,
  showHomeIndicator: true,

  contentScale: 100,
};

interface DesignContextValue {
  params: DesignParams;
  update: (key: keyof DesignParams, value: number | string | boolean) => void;
  reset: () => void;
}

const DesignContext = createContext<DesignContextValue | null>(null);

export function DesignProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useState<DesignParams>(defaults);

  const update = (key: keyof DesignParams, value: number | string | boolean) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setParams({ ...defaults });
  };

  return (
    <DesignContext.Provider value={{ params, update, reset }}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const ctx = useContext(DesignContext);
  if (!ctx) throw new Error('useDesign must be inside DesignProvider');
  return ctx;
}
