import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import {
  Info, Plug, Sparkles, Minus, Ban, AlertTriangle, RefreshCw, Lock, Inbox, Loader2, CircleSlash, FileQuestion,
} from 'lucide-react';
import { useProto } from '../lib/prototype';
import { bandOf, type Evidence, type L, type Severity } from '../lib/sample';

export function useL() {
  const { lang } = useProto();
  return (v: L) => v[lang];
}

/** Angka, URL, dan kode tetap LTR di dalam teks Arab. */
export function Ltr({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <bdi dir="ltr" className={`num ${className}`}>{children}</bdi>;
}

const BRAND = `${import.meta.env.BASE_URL}brand/`;

/**
 * Logo VoxAudit resmi. File yang tersedia baru versi teks putih, jadi logo
 * penuh hanya dipakai di atas shell gelap. Di atas kanvas terang dipakai mark V
 * + teks HTML sampai versi logo terang diterima.
 */
export function Logo({ compact = false, onDark = true, size = 'md' }: { compact?: boolean; onDark?: boolean; size?: 'md' | 'lg' }) {
  if (compact) {
    return <img src={`${BRAND}voxaudit-mark.png`} alt="VoxAudit" className="w-9 h-9 object-contain shrink-0" />;
  }
  if (onDark) {
    return (
      <img src={`${BRAND}voxaudit-logo-dark.png`} alt="VoxAudit by Voxlumedia"
        className={`${size === 'lg' ? 'h-14' : 'h-10'} w-auto object-contain shrink-0`} />
    );
  }
  return (
    <span className="flex items-center gap-2 min-w-0">
      <img src={`${BRAND}voxaudit-mark.png`} alt="" className="w-8 h-8 object-contain shrink-0" />
      <span className="font-display font-extrabold text-[15px] text-ink tracking-tight">VOX<span className="font-black">AUDIT</span></span>
    </span>
  );
}

/* ---------- Evidence language ---------- */

const EVIDENCE_STYLE: Record<Evidence, string> = {
  measured: 'bg-surface-2 text-ink border-line',
  connected: 'bg-primary-soft text-primary-strong border-primary/30',
  estimated: 'bg-surface text-muted border-dashed border-muted/60',
  ai: 'bg-ai-soft text-ai border-ai/30',
  unavailable: 'bg-surface-2 text-muted border-line',
  na: 'bg-surface-2 text-muted border-line',
};

export function EvidenceBadge({ type, short = false }: { type: Evidence; short?: boolean }) {
  const { t } = useProto();
  const label = {
    measured: t('ev.measured'), connected: t('ev.connected'),
    estimated: short ? t('ev.estimatedShort') : t('ev.estimated'),
    ai: t('ev.ai'), unavailable: t('ev.unavailable'), na: t('ev.na'),
  }[type];
  const desc = {
    measured: t('ev.measured.d'), connected: t('ev.connected.d'), estimated: t('ev.estimated.d'),
    ai: t('ev.ai.d'), unavailable: t('ev.unavailable.d'), na: t('ev.unavailable.d'),
  }[type];
  return (
    <span title={desc} className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[12px] font-medium leading-4 ${EVIDENCE_STYLE[type]}`}>
      {type === 'measured' && <span className="w-2 h-2 rounded-sm bg-ink/70" aria-hidden="true" />}
      {type === 'connected' && <Plug className="w-3 h-3" aria-hidden="true" />}
      {type === 'estimated' && <span className="w-2 h-2 rounded-sm text-muted hatch border border-muted/60" aria-hidden="true" />}
      {type === 'ai' && <Sparkles className="w-3 h-3" aria-hidden="true" />}
      {(type === 'unavailable' || type === 'na') && <Minus className="w-3 h-3" aria-hidden="true" />}
      {label}
    </span>
  );
}

/** Penanda kecil magenta untuk teks yang ditulis AI. */
export function AiMarker({ children }: { children: ReactNode }) {
  const { t } = useProto();
  return (
    <div className="relative ps-4 border-s-2 border-ai">
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-ai mb-1">
        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> {t('ev.ai')}
      </span>
      <div>{children}</div>
    </div>
  );
}

/** Nilai yang tidak tersedia: tanda pisah abu-abu + alasan. Tidak pernah 0. */
export function Unavailable({ reason }: { reason: string }) {
  return (
    <span className="inline-flex items-start gap-1.5 text-muted">
      <Minus className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
      <span className="text-sm">{reason}</span>
    </span>
  );
}

/* ---------- Scores ---------- */

const BAND_STYLE = {
  critical: 'bg-critical-soft text-critical',
  needsWork: 'bg-watch-soft text-watch',
  solid: 'bg-good-soft text-good',
  strong: 'bg-good-soft text-good',
} as const;

export function BandBadge({ score }: { score: number }) {
  const { t } = useProto();
  const band = bandOf(score);
  const label = { critical: t('band.critical'), needsWork: t('band.needsWork'), solid: t('band.solid'), strong: t('band.strong') }[band];
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[12px] font-semibold ${BAND_STYLE[band]}`}>{label}</span>;
}

export function CoverageMeter({ value, showLabel = true }: { value: number; showLabel?: boolean }) {
  const { t } = useProto();
  const tone = value >= 75 ? 'bg-ink/70' : value >= 50 ? 'bg-watch' : 'bg-critical';
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className="relative h-1.5 w-20 rounded-full bg-surface-2 border border-line overflow-hidden shrink-0"
        role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label={t('dash.coverage')}
      >
        <div className={`absolute inset-y-0 start-0 ${tone}`} style={{ width: `${value}%` }} />
      </div>
      {showLabel && <span className="text-[12px] text-muted whitespace-nowrap"><Ltr>{value}%</Ltr> {t('col.coverage').toLowerCase()}</span>}
    </div>
  );
}

/** Skor 0–100 + band + meter cakupan bukti (aturan: tak ada skor tanpa cakupan). */
export function ScoreBlock({ score, coverage, size = 'md' }: { score: number | null; coverage: number; size?: 'md' | 'lg' }) {
  const { t } = useProto();
  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2 flex-wrap">
        {score === null ? (
          <span className="text-muted font-display font-bold text-2xl" aria-label={t('cs.insufficient')}>—</span>
        ) : (
          <>
            <span className={`font-display font-bold num ${size === 'lg' ? 'text-5xl' : 'text-3xl'}`}><Ltr>{score}</Ltr></span>
            <span className="text-muted text-sm"><Ltr>/ 100</Ltr></span>
            <BandBadge score={score} />
          </>
        )}
      </div>
      <CoverageMeter value={coverage} />
    </div>
  );
}

/* ---------- Status & severity ---------- */

const SEV_STYLE: Record<Severity, string> = {
  critical: 'bg-critical-soft text-critical',
  high: 'bg-critical-soft/60 text-critical',
  medium: 'bg-watch-soft text-watch',
  low: 'bg-surface-2 text-muted',
};

export function SeverityBadge({ level }: { level: Severity }) {
  const { t } = useProto();
  const label = { critical: t('sev.critical'), high: t('sev.high'), medium: t('sev.medium'), low: t('sev.low') }[level];
  return <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[12px] font-semibold ${SEV_STYLE[level]}`}>{label}</span>;
}

/* ---------- Info tooltip (definisi · periode · sumber) ---------- */

export function InfoTip({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick); };
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="p-1 -m-1 rounded text-muted hover:text-ink"
      >
        <Info className="w-4 h-4" aria-hidden="true" />
      </button>
      {open && (
        <span id={id} role="dialog" aria-label={label}
          className="absolute z-30 top-7 end-0 w-72 max-w-[80vw] card shadow-pop p-3 text-sm text-ink text-start">
          {children}
        </span>
      )}
    </span>
  );
}

/* ---------- Banner data contoh (wajib di setiap layar) ---------- */

export function SampleBanner() {
  const { t } = useProto();
  return (
    <div role="note" className="bg-[#fff4d6] text-[#5c3d00] border-b border-[#f0d58a] px-4 py-1.5 text-[13px] font-medium flex items-center gap-2 justify-center text-center">
      <FileQuestion className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>{t('sample.banner')}</span>
    </div>
  );
}

/* ---------- Cross-cutting states (didesain sekali, dipakai di mana-mana) ---------- */

export type CommonState = 'empty' | 'loading' | 'partial' | 'unavailable' | 'insufficient' | 'na' | 'error' | 'denied';

export function StateCard({ state, title, body, action }: { state: CommonState; title?: string; body?: string; action?: ReactNode }) {
  const { t } = useProto();
  const meta = {
    empty: { icon: Inbox, title: t('cs.empty'), tone: 'text-muted' },
    loading: { icon: Loader2, title: t('cs.loading'), tone: 'text-muted' },
    partial: { icon: AlertTriangle, title: t('cs.partial'), tone: 'text-watch' },
    unavailable: { icon: Minus, title: t('cs.unavailable'), tone: 'text-muted' },
    insufficient: { icon: CircleSlash, title: t('cs.insufficient'), tone: 'text-muted' },
    na: { icon: Ban, title: t('cs.na'), tone: 'text-muted' },
    error: { icon: AlertTriangle, title: t('cs.error'), tone: 'text-critical' },
    denied: { icon: Lock, title: t('cs.denied'), tone: 'text-muted' },
  }[state];
  const Icon = meta.icon;

  if (state === 'loading') {
    return (
      <div className="card p-4 space-y-3" aria-busy="true" aria-label={t('cs.loading')}>
        <div className="h-4 w-1/3 rounded bg-surface-2 animate-pulse" />
        <div className="h-3 w-full rounded bg-surface-2 animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-surface-2 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="card p-4 flex gap-3 items-start" role={state === 'error' ? 'alert' : undefined}>
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${meta.tone}`} aria-hidden="true" />
      <div className="space-y-1 min-w-0">
        <p className="font-semibold">{title ?? meta.title}</p>
        {body && <p className="text-muted">{body}</p>}
        {state === 'error' && !action && (
          <button type="button" className="btn-secondary h-8 mt-2"><RefreshCw className="w-4 h-4" aria-hidden="true" />{t('cs.retry')}</button>
        )}
        {action && <div className="pt-2">{action}</div>}
      </div>
    </div>
  );
}

export function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-3">
      <div className="min-w-0">
        <h2 className="font-semibold text-base">{title}</h2>
        {sub && <p className="text-muted mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
