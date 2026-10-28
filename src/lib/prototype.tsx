import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translate, type Lang, type TKey } from './i18n';

// Peran sesuai tabel persona di Phase 1. Navigasi dibangun dari peran ini
// (lihat nav.ts), bukan dengan menyembunyikan link lewat CSS.
export type Role = 'platform' | 'owner' | 'member' | 'consultant' | 'business' | 'client';
export type Theme = 'light' | 'dark';
export type DashState = 'empty' | 'partial' | 'populated';

type Prefs = { lang: Lang; theme: Theme; role: Role; dashState: DashState; signedIn: boolean };

const DEFAULTS: Prefs = { lang: 'en', theme: 'light', role: 'owner', dashState: 'populated', signedIn: false };
const KEY = 'vai.prototype.prefs';

function load(): Prefs {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

type Ctx = Prefs & {
  set: <K extends keyof Prefs>(key: K, value: Prefs[K]) => void;
  t: (key: TKey, vars?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
};

const PrototypeContext = createContext<Ctx | null>(null);

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch { /* penyimpanan diblokir: abaikan */ }
    const root = document.documentElement;
    root.lang = prefs.lang;
    root.dir = prefs.lang === 'ar' ? 'rtl' : 'ltr';
    root.classList.toggle('dark', prefs.theme === 'dark');
  }, [prefs]);

  const value = useMemo<Ctx>(() => ({
    ...prefs,
    dir: prefs.lang === 'ar' ? 'rtl' : 'ltr',
    set: (key, v) => setPrefs((p) => ({ ...p, [key]: v })),
    t: (key, vars) => translate(prefs.lang, key, vars),
  }), [prefs]);

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

export function useProto() {
  const ctx = useContext(PrototypeContext);
  if (!ctx) throw new Error('useProto must be used inside PrototypeProvider');
  return ctx;
}
