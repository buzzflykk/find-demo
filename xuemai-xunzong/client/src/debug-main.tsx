import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/common/ThemeProvider';
import { AuthProvider } from './hooks/useAuth';
import AppLayout from './components/layout/AppLayout';
import PhoneFrame from './components/layout/PhoneFrame';
import Login from './pages/Login';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Publish from './pages/Publish';
import MissingDetail from './pages/MissingDetail';
import ChatDetail from './pages/ChatDetail';
import MatchResult from './pages/MatchResult';
import Notifications from './pages/Notifications';
import MyMissing from './pages/MyMissing';
import FoundArchive from './pages/FoundArchive';
import Settings from './pages/Settings';
import Membership from './pages/Membership';
import PublicMissingPage from './pages/PublicMissingPage';
import { DesignProvider, useDesign } from './components/design/DesignContext';
import { PhoneParamsProvider } from './components/layout/PhoneFrame';
import DesignPanel from './components/design/DesignPanel';
import './index.css';

/** Bridge DesignContext → PhoneParamsProvider so sliders control the frame */
function DesignBridge({ children }: { children: React.ReactNode }) {
  const { params } = useDesign();
  return (
    <PhoneParamsProvider
      overrides={{
        phoneWidth: params.phoneWidth,
        phoneHeight: params.phoneHeight,
        phoneBorderRadius: params.phoneBorderRadius,
        phoneBorderWidth: params.phoneBorderWidth,
        phoneBorderColor: params.phoneBorderColor,
        shadowIntensity: params.shadowIntensity,
        bgGradientFrom: params.bgGradientFrom,
        bgGradientVia: params.bgGradientVia,
        bgGradientTo: params.bgGradientTo,
        ambientGlowSize: params.ambientGlowSize,
        ambientGlowOpacity: params.ambientGlowOpacity,
        ambientGlowColor: params.ambientGlowColor,
        paperOpacity: params.paperOpacity,
        statusBarHeight: params.statusBarHeight,
        statusBarFontSize: params.statusBarFontSize,
        statusBarOpacity: params.statusBarOpacity,
        showSignal: params.showSignal,
        showWifi: params.showWifi,
        showBattery: params.showBattery,
        timeHours: params.timeHours,
        timeMinutes: params.timeMinutes,
        notchWidth: params.notchWidth,
        notchHeight: params.notchHeight,
        showNotch: params.showNotch,
        contentAreaHeight: params.contentAreaHeight,
        homeIndicatorWidth: params.homeIndicatorWidth,
        homeIndicatorHeight: params.homeIndicatorHeight,
        showHomeIndicator: params.showHomeIndicator,
        contentScale: params.contentScale,
      }}
    >
      {children}
    </PhoneParamsProvider>
  );
}

function DebugApp() {
  return (
    <DesignProvider>
      <DesignBridge>
        <PhoneFrame>
          <Routes>
            <Route path="/debug.html" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Login />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/publish" element={<Publish />} />
              <Route path="/missing/:id" element={<MissingDetail />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/chat/:missingPersonId/:otherUserId" element={<ChatDetail />} />
              <Route path="/match/:missingPersonId" element={<MatchResult />} />
              <Route path="/public/missing/:id" element={<PublicMissingPage />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/my-missing" element={<MyMissing />} />
              <Route path="/found-archive" element={<FoundArchive />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </PhoneFrame>
      </DesignBridge>
      <DesignPanel />
    </DesignProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <DebugApp />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
