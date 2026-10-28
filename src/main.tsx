import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import { PrototypeProvider, useProto } from './lib/prototype';
import { homePath } from './lib/workspace';
import { AppShell } from './components/AppShell';
import { AuthPage } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { DesignSystem } from './pages/DesignSystem';
import { Planned, SeparateSurface } from './pages/Planned';

function RequireAuth({ children }: { children: ReactNode }) {
  const { signedIn } = useProto();
  return signedIn ? <>{children}</> : <Navigate to="/signin" replace />;
}

function Home() {
  const { signedIn, role } = useProto();
  return <Navigate to={signedIn ? homePath(role) : '/signin'} replace />;
}

// HashRouter agar prototype bisa disajikan dari hosting statis mana pun.
// Bentuk URL mengikuti Phase 1: /w/{workspace}/c/{client}/...
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route path="*" element={<Home />} />
      </Routes>
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
