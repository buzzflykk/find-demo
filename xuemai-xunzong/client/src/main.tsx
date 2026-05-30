import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/common/ThemeProvider';
import { AuthProvider } from './hooks/useAuth';
import AppLayout from './components/layout/AppLayout';
import PhoneFrame from './components/layout/PhoneFrame';
import Login from './pages/Login';
import Splash from './pages/Splash';
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
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <PhoneFrame>
            <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route element={<AppLayout />}>
              <Route path="/home" element={<Home />} />
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
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
