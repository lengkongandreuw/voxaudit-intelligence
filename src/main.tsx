import { lazy, StrictMode, Suspense, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import { PrototypeProvider, useProto } from './lib/prototype';
import { Landing } from './pages/Landing';
import { AuthPage } from './pages/Auth';

// Landing & auth ada di bundle awal; aplikasi dimuat saat dibutuhkan
// agar halaman promosi tetap ringan.
const AppShell = lazy(() => import('./components/AppShell').then((m) => ({ default: m.AppShell })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const DesignSystem = lazy(() => import('./pages/DesignSystem').then((m) => ({ default: m.DesignSystem })));
const Planned = lazy(() => import('./pages/Planned').then((m) => ({ default: m.Planned })));
const SeparateSurface = lazy(() => import('./pages/Planned').then((m) => ({ default: m.SeparateSurface })));

function RequireAuth({ children }: { children: ReactNode }) {
  const { signedIn } = useProto();
  return signedIn ? <>{children}</> : <Navigate to="/signin" replace />;
}

// HashRouter agar prototype bisa disajikan dari hosting statis mana pun.
// Bentuk URL mengikuti Phase 1: /w/{workspace}/c/{client}/...
function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div className="min-h-screen bg-shell" aria-busy="true" />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<AuthPage mode="signin" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/reset" element={<AuthPage mode="reset" />} />
          <Route path="/sso" element={<AuthPage mode="sso" />} />
          <Route path="/invite/:token" element={<AuthPage mode="invite" />} />
          <Route path="/portal" element={<RequireAuth><SeparateSurface kind="portal" /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><SeparateSurface kind="admin" /></RequireAuth>} />
          <Route path="/w/:ws/c/:client" element={<RequireAuth><AppShell /></RequireAuth>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="design-system" element={<DesignSystem />} />
            <Route path="*" element={<Planned />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrototypeProvider>
      <App />
    </PrototypeProvider>
  </StrictMode>,
);
