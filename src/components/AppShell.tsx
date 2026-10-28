import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell, ChevronsLeft, ChevronDown, Menu, Search, SlidersHorizontal, X, LogOut, Plus, BookOpen,
  LayoutDashboard, Gauge, FileText, Lightbulb, MoreHorizontal, ShieldAlert,
} from 'lucide-react';
import { useProto, type Role, type DashState } from '../lib/prototype';
import { navFor, PLATFORM_ITEM, type NavGroup, type NavItem } from '../lib/nav';
import { homePath, useScope } from '../lib/workspace';
import { Logo, SampleBanner, useL } from './ui';

const ROLES: Role[] = ['owner', 'member', 'consultant', 'business', 'client', 'platform'];

function useMediaQuery(q: string) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

/* ---------------- Sidebar ---------------- */

function NavEntry({ item, base, collapsed, onNavigate }: { item: NavItem; base: string; collapsed: boolean; onNavigate?: () => void }) {
  const { t } = useProto();
  const Icon = item.icon;
  const to = item.path.startsWith('/') ? item.path : `${base}/${item.path}`;
  return (
    <NavLink
      to={to}
      end
      onClick={onNavigate}
      title={collapsed ? t(item.label) : undefined}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-lg h-9 text-sm transition-colors relative
         ${collapsed ? 'justify-center px-0' : 'px-3'}
         ${isActive ? 'bg-white/[0.08] text-white font-semibold' : 'text-shell-muted hover:text-shell-text hover:bg-white/[0.04]'}`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute start-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-highlight" aria-hidden="true" />}
          <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-highlight' : ''}`} aria-hidden="true" />
          {!collapsed && <span className="truncate">{t(item.label)}</span>}
          {collapsed && <span className="sr-only">{t(item.label)}</span>}
        </>
      )}
    </NavLink>
  );
}

function NavGroups({ groups, base, collapsed, onNavigate }: { groups: NavGroup[]; base: string; collapsed: boolean; onNavigate?: () => void }) {
  const { t } = useProto();
  return (
    <>
      {groups.map((g) => (
        <div key={g.id} className="space-y-0.5">
          {collapsed
            ? <div className="h-px bg-shell-border mx-3 my-3" aria-hidden="true" />
            : <p className="px-3 pt-4 pb-1.5 text-[12px] font-semibold uppercase tracking-wider text-shell-muted/80">{t(g.label)}</p>}
          <ul className="space-y-0.5" aria-label={t(g.label)}>
            {g.items.map((i) => <li key={i.id}><NavEntry item={i} base={base} collapsed={collapsed} onNavigate={onNavigate} /></li>)}
          </ul>
        </div>
      ))}
    </>
  );
}

function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const { t, role } = useProto();
  const { ws, base } = useScope();
  const L = useL();
  const groups = navFor(role);

  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 bg-shell text-shell-text border-e border-shell-border
        sticky top-0 h-screen transition-[width] duration-200 ${collapsed ? 'w-sidebar-collapsed' : 'w-sidebar'}`}
      aria-label={t('nav.menu')}
    >
      <div className={`h-16 flex items-center border-b border-shell-border ${collapsed ? 'justify-center' : 'px-4'}`}>
        <Logo compact={collapsed} />
      </div>
      {!collapsed && (
        <div className="px-4 py-3 border-b border-shell-border">
          <p className="text-[12px] text-shell-muted">{t('nav.workspace')}</p>
          <p className="font-semibold truncate">{L(ws.name)}</p>
        </div>
      )}
      <nav className="flex-1 overflow-y-auto scroll-thin px-3 pb-4" aria-label={t('nav.menu')}>
        <NavGroups groups={groups} base={base} collapsed={collapsed} />
        {role === 'platform' && (
          <div className="pt-3 mt-3 border-t border-shell-border">
            {!collapsed && <p className="px-3 pb-1.5 text-[12px] font-semibold uppercase tracking-wider text-shell-muted/80">{t('nav.platform')}</p>}
            <NavEntry item={PLATFORM_ITEM} base={base} collapsed={collapsed} />
          </div>
        )}
      </nav>
      <div className="border-t border-shell-border p-3 space-y-1">
        <NavLink to={`${base}/design-system`}
          className={({ isActive }) => `flex items-center gap-3 rounded-lg h-9 text-sm ${collapsed ? 'justify-center' : 'px-3'} ${isActive ? 'bg-white/[0.08] text-white' : 'text-shell-muted hover:text-shell-text'}`}
          title={collapsed ? t('nav.designSystem') : undefined}>
          <BookOpen className="w-[18px] h-[18px]" aria-hidden="true" />
          {collapsed ? <span className="sr-only">{t('nav.designSystem')}</span> : t('nav.designSystem')}
        </NavLink>
        <button type="button" onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-3 rounded-lg h-9 text-sm text-shell-muted hover:text-shell-text ${collapsed ? 'justify-center' : 'px-3'}`}
          aria-label={collapsed ? t('nav.expand') : t('nav.collapse')} aria-expanded={!collapsed}>
          <ChevronsLeft className={`w-[18px] h-[18px] transition-transform rtl:rotate-180 ${collapsed ? 'rotate-180 rtl:rotate-0' : ''}`} aria-hidden="true" />
          {!collapsed && t('nav.collapse')}
        </button>
      </div>
    </aside>
  );
}

/* ---------------- Mobile drawer & bottom nav ---------------- */

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, role } = useProto();
  const { base } = useScope();
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="md:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t('nav.menu')}>
      <button type="button" className="absolute inset-0 bg-black/50" aria-label={t('nav.close')} onClick={onClose} tabIndex={-1} />
      <div className="absolute inset-y-0 start-0 w-[84%] max-w-[320px] bg-shell text-shell-text flex flex-col">
        <div className="h-14 px-4 flex items-center justify-between border-b border-shell-border">
          <Logo />
          <button ref={closeRef} type="button" onClick={onClose} className="p-2 -m-2 text-shell-muted hover:text-white" aria-label={t('nav.close')}>
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto scroll-thin px-3 pb-6">
          <NavGroups groups={navFor(role)} base={base} collapsed={false} onNavigate={onClose} />
          {role === 'platform' && <div className="pt-3"><NavEntry item={PLATFORM_ITEM} base={base} collapsed={false} onNavigate={onClose} /></div>}
          <div className="pt-3 mt-3 border-t border-shell-border">
            <NavEntry item={{ id: 'ds', label: 'nav.designSystem', icon: BookOpen, path: 'design-system', roles: [] }} base={base} collapsed={false} onNavigate={onClose} />
          </div>
        </nav>
      </div>
    </div>
  );
}

function BottomNav({ onMore }: { onMore: () => void }) {
  const { t } = useProto();
  const { base } = useScope();
  const items = [
    { to: `${base}/dashboard`, label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: `${base}/intelligence`, label: t('nav.intelligence'), icon: Gauge },
    { to: `${base}/reports/latest`, label: t('nav.report'), icon: FileText },
    { to: `${base}/growth/roadmap`, label: t('nav.growth'), icon: Lightbulb },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-shell border-t border-shell-border pb-[env(safe-area-inset-bottom)]" aria-label={t('nav.menu')}>
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink to={to} end className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2 text-[12px] ${isActive ? 'text-highlight' : 'text-shell-muted'}`}>
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="truncate max-w-full px-1">{label}</span>
            </NavLink>
          </li>
        ))}
        <li>
          <button type="button" onClick={onMore} className="w-full flex flex-col items-center gap-0.5 py-2 text-[12px] text-shell-muted">
            <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
            {t('nav.more')}
          </button>
        </li>
      </ul>
    </nav>
  );
}

/* ---------------- Top bar ---------------- */

function Popover({ label, button, children, align = 'end' }: { label: string; button: React.ReactNode; children: (close: () => void) => React.ReactNode; align?: 'start' | 'end' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick); };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-haspopup="dialog" aria-expanded={open} aria-label={label} onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 h-9 rounded-lg px-2.5 text-shell-text hover:bg-white/[0.06]">
        {button}
      </button>
      {open && (
        <div role="dialog" aria-label={label}
          className={`absolute z-50 mt-2 ${align === 'end' ? 'end-0' : 'start-0'} w-[300px] max-w-[calc(100vw-24px)] card shadow-pop p-3 text-ink`}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-1 p-1 rounded-lg bg-surface-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <button key={o.v} type="button" role="radio" aria-checked={value === o.v} onClick={() => onChange(o.v)}
          className={`h-8 rounded-md text-sm font-medium ${value === o.v ? 'bg-surface shadow-card text-ink' : 'text-muted hover:text-ink'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function PrototypeControls() {
  const p = useProto();
  const navigate = useNavigate();
  const { client } = useScope();
  const { t } = p;
  return (
    <Popover label={t('top.prototype')} button={<><SlidersHorizontal className="w-4 h-4" aria-hidden="true" /><span className="hidden lg:inline text-sm">{t('top.prototype')}</span></>}>
      {(close) => (
        <div className="space-y-4">
          <div>
            <label htmlFor="proto-role" className="label">{t('top.role')}</label>
            <select id="proto-role" className="input" value={p.role}
              onChange={(e) => { const r = e.target.value as Role; p.set('role', r); navigate(homePath(r, client.id)); close(); }}>
              {ROLES.map((r) => <option key={r} value={r}>{t(`role.${r}` as const)}</option>)}
            </select>
          </div>
          <div>
            <p className="label" id="proto-state">{t('top.dashState')}</p>
            <select aria-labelledby="proto-state" className="input" value={p.dashState} onChange={(e) => p.set('dashState', e.target.value as DashState)}>
              {(['empty', 'partial', 'populated'] as DashState[]).map((s) => <option key={s} value={s}>{t(`state.${s}` as const)}</option>)}
            </select>
          </div>
          <div>
            <p className="label">{t('top.language')}</p>
            <Segmented label={t('top.language')} value={p.lang} onChange={(v) => p.set('lang', v)} options={[{ v: 'en', label: 'English' }, { v: 'ar', label: 'العربية' }]} />
          </div>
          <div>
            <p className="label">{t('top.theme')}</p>
            <Segmented label={t('top.theme')} value={p.theme} onChange={(v) => p.set('theme', v)} options={[{ v: 'light', label: t('top.light') }, { v: 'dark', label: t('top.dark') }]} />
          </div>
        </div>
      )}
    </Popover>
  );
}

function ClientSwitcher() {
  const { t } = useProto();
  const L = useL();
  const { ws, client } = useScope();
  const navigate = useNavigate();
  if (ws.kind === 'business') {
    return <span className="text-shell-text font-semibold truncate">{L(client.name)}</span>;
  }
  return (
    <Popover align="start" label={t('top.switchClient')} button={
      <span className="flex items-center gap-2 min-w-0">
        <span className="hidden sm:inline text-shell-muted text-sm">{t('top.client')}</span>
        <span className="font-semibold truncate max-w-[40vw] sm:max-w-[220px]">{L(client.name)}</span>
        <ChevronDown className="w-4 h-4 text-shell-muted shrink-0" aria-hidden="true" />
      </span>
    }>
      {(close) => (
        <ul className="space-y-1" aria-label={t('top.switchClient')}>
          {ws.clients.map((c) => (
            <li key={c.id}>
              {/* Ganti klien = navigasi ke dashboard klien itu, sehingga konteks lama dibersihkan */}
              <button type="button" onClick={() => { navigate(`/w/${ws.id}/c/${c.id}/dashboard`); close(); }}
                aria-current={c.id === client.id ? 'true' : undefined}
                className={`w-full text-start rounded-lg px-3 py-2 hover:bg-surface-2 ${c.id === client.id ? 'bg-primary-soft' : ''}`}>
                <span className="block font-medium">{L(c.name)}</span>
                <span className="block text-muted text-[13px]">{L(c.locations)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Popover>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  const p = useProto();
  const { t } = p;
  const { base } = useScope();
  const navigate = useNavigate();
  return (
    <header className="h-14 md:h-16 bg-shell text-shell-text border-b border-shell-border flex items-center gap-2 px-3 md:px-6 sticky top-0 z-30">
      <button type="button" className="md:hidden p-2 -ms-1 text-shell-muted hover:text-white" onClick={onMenu} aria-label={t('nav.menu')}>
        <Menu className="w-5 h-5" aria-hidden="true" />
      </button>
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <ClientSwitcher />
        <label className="hidden lg:flex items-center gap-2 h-9 rounded-lg bg-white/[0.06] px-3 w-[320px] ms-2 text-shell-muted focus-within:ring-2 focus-within:ring-primary">
          <Search className="w-4 h-4" aria-hidden="true" />
          <span className="sr-only">{t('top.search')}</span>
          <input type="search" placeholder={t('top.search')} className="bg-transparent outline-none text-sm text-shell-text placeholder:text-shell-muted w-full" />
        </label>
      </div>
      <button type="button" className="hidden sm:inline-flex btn-brand h-9" onClick={() => navigate(`${base}/audits/new`)}>
        <Plus className="w-4 h-4" aria-hidden="true" />{t('top.createAudit')}
      </button>
      <button type="button" className="sm:hidden p-2 rounded-lg text-white" style={{ backgroundImage: 'linear-gradient(90deg,#0077c2,#7c3aed)' }}
        onClick={() => navigate(`${base}/audits/new`)} aria-label={t('top.createAudit')}>
        <Plus className="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" className="relative p-2 text-shell-muted hover:text-white" aria-label={t('top.notifications')}>
        <Bell className="w-5 h-5" aria-hidden="true" />
        <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-highlight" aria-hidden="true" />
      </button>
      <PrototypeControls />
      <button type="button" className="p-2 text-shell-muted hover:text-white" aria-label={t('top.signOut')}
        onClick={() => { p.set('signedIn', false); navigate('/signin'); }}>
        <LogOut className="w-5 h-5 rtl:rotate-180" aria-hidden="true" />
      </button>
    </header>
  );
}

/* ---------------- Shell ---------------- */

export function AppShell() {
  const { t, role } = useProto();
  // Tablet (sampai 1024 px, ditambah margin laptop kecil) mulai dengan sidebar terlipat
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1279px)');
  const [collapsed, setCollapsed] = useState(isTablet);
  const [drawer, setDrawer] = useState(false);
  const location = useLocation();

  useEffect(() => { setCollapsed(isTablet); }, [isTablet]);
  useEffect(() => { setDrawer(false); document.getElementById('main')?.focus({ preventScroll: true }); window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[60] btn-primary">{t('skip')}</a>
      <SampleBanner />
      <div className="flex flex-1 min-h-0">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="flex-1 min-w-0 flex flex-col">
          <TopBar onMenu={() => setDrawer(true)} />
          {role === 'platform' && (
            <div role="status" className="bg-watch-soft text-watch border-b border-watch/30 px-4 md:px-6 py-2 text-sm font-medium flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />{t('top.loggedAccess')}
            </div>
          )}
          <main id="main" tabIndex={-1} className="flex-1 outline-none pb-24 md:pb-10">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} />
      <BottomNav onMore={() => setDrawer(true)} />
    </div>
  );
}
