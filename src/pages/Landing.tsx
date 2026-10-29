import { createElement, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowDown, Check, Menu, X, Loader2, CheckCircle2, XCircle, Circle } from 'lucide-react';
import { useProto } from '../lib/prototype';
import { LANDING } from '../lib/landing-copy';
import { homePath } from '../lib/workspace';
import { reducedMotion, useCountUp, useMagnetic, usePointerTilt, useReveal, useScrollProgress } from '../lib/motion';
import { Ltr, SampleBanner } from '../components/ui';

const BRAND = `${import.meta.env.BASE_URL}brand/`;

function useCopy() {
  const { lang } = useProto();
  return LANDING[lang];
}

/* ---------------- Bagian kecil yang dipakai ulang ---------------- */

function LogoBars({ className = '' }: { className?: string }) {
  return (
    <span className={`lp-bars ${className}`} aria-hidden="true">
      <i style={{ width: 22, background: '#ff3d2e' }} />
      <i style={{ width: 16, background: '#ff7a1a' }} />
      <i style={{ width: 28, background: '#ffb020' }} />
    </span>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="lp-mono text-[13px] uppercase text-white/55 flex items-center gap-3" data-reveal>
      <LogoBars />{children}
    </p>
  );
}

function Magnetic({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useMagnetic(ref, 0.18);
  return <span ref={ref} className={`inline-flex transition-transform duration-300 ${className}`}>{children}</span>;
}

/** Form "tempel link" — dipakai di hero dan CTA akhir. */
function AuditForm({ id, tone = 'dark' }: { id: string; tone?: 'dark' | 'ember' }) {
  const c = useCopy();
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(v)) { setError(c.heroError); return; }
    navigate('/signup', { state: { auditUrl: v } });
  };
  const onEmber = tone === 'ember';
  return (
    <form onSubmit={submit} noValidate className="w-full max-w-xl">
      <label htmlFor={id} className="sr-only">{c.heroInput}</label>
      <div className={`flex flex-col sm:flex-row gap-2 p-1.5 rounded-[28px] sm:rounded-full border transition-colors
        ${onEmber ? 'bg-[#07061a]/10 border-[#07061a]/20 focus-within:border-[#07061a]/60' : 'bg-white/[0.05] border-white/15 focus-within:border-[rgb(var(--ember))]'}`}>
        <input
          id={id} type="text" inputMode="url" autoComplete="url" value={value}
          onChange={(e) => { setValue(e.target.value); setError(''); }}
          placeholder={c.heroPlaceholder}
          aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined}
          className={`flex-1 min-w-0 bg-transparent outline-none px-5 h-12 text-[15px] font-medium
            ${onEmber ? 'text-[#07061a] placeholder:text-[#07061a]/55' : 'text-white placeholder:text-white/40'}`}
        />
        <Magnetic>
          <button type="submit" className={`lp-btn w-full sm:w-auto ${onEmber ? 'bg-[#07061a] text-white hover:bg-black' : 'lp-btn-ember'}`}>
            {c.heroCta}<ArrowRight className="lp-arrow w-4 h-4" aria-hidden="true" />
          </button>
        </Magnetic>
      </div>
      {error && <p id={`${id}-err`} role="alert" className={`mt-2 ps-5 text-sm font-medium ${onEmber ? 'text-[#07061a]' : 'text-[#ff8a5c]'}`}>{error}</p>}
    </form>
  );
}

/* ---------------- Nav ---------------- */

function Nav() {
  const c = useCopy();
  const p = useProto();
  const navigate = useNavigate();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const links = [['#product', c.navProduct], ['#how', c.navHow], ['#evidence', c.navEvidence], ['#who', c.navWho]];
  const openDemo = () => { p.set('role', 'owner'); p.set('dashState', 'populated'); p.set('signedIn', true); navigate(homePath('owner')); };

  return (
    <header className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 border-b
      ${solid || open ? 'bg-[#07061a]/80 backdrop-blur-xl border-white/10' : 'bg-transparent border-transparent'}`}>
      <nav className="max-w-[1320px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-6" aria-label="Main">
        <a href="#top" className="shrink-0"><img src={`${BRAND}voxaudit-logo-dark.png`} alt="VoxAudit by Voxlumedia" className="h-9 w-auto" /></a>
        <ul className="hidden lg:flex items-center gap-7 text-[14px] text-white/70 ms-4">
          {links.map(([href, label]) => <li key={href}><a href={href} className="hover:text-white transition-colors">{label}</a></li>)}
        </ul>
        <div className="ms-auto flex items-center gap-2">
          <button type="button" onClick={() => p.set('lang', p.lang === 'en' ? 'ar' : 'en')}
            className="h-10 px-3 rounded-full text-[14px] text-white/70 hover:text-white border border-white/15">
            {p.lang === 'en' ? 'العربية' : 'English'}
          </button>
          <Link to="/signin" className="hidden sm:inline-flex h-10 items-center px-4 text-[14px] text-white/80 hover:text-white">{c.navSignIn}</Link>
          <button type="button" onClick={openDemo} className="hidden md:inline-flex lp-btn lp-btn-ghost h-10 px-4 text-[14px]">{c.navDemo}</button>
          <Link to="/signup" className="hidden sm:inline-flex lp-btn lp-btn-ember h-10 px-5 text-[14px]">{c.navCta}</Link>
          <button type="button" className="lg:hidden p-2 text-white" aria-expanded={open} aria-controls="lp-menu" aria-label={c.navMenu} onClick={() => setOpen((o) => !o)}>
            {open ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="lp-menu" className="lg:hidden border-t border-white/10 px-4 pb-6">
          <ul className="py-3">
            {links.map(([href, label]) => (
              <li key={href}><a href={href} onClick={() => setOpen(false)} className="block py-3 text-lg text-white/85 border-b border-white/[0.06]">{label}</a></li>
            ))}
          </ul>
          <div className="grid gap-2">
            <Link to="/signup" className="lp-btn lp-btn-ember">{c.navCta}</Link>
            <button type="button" onClick={openDemo} className="lp-btn lp-btn-ghost">{c.navDemo}</button>
            <Link to="/signin" className="lp-btn text-white/80">{c.navSignIn}</Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------- Hero ---------------- */

/** Poster langsung tampil (LCP ringan); model 3D dimuat saat idle, hanya di desktop. */
function HeroMascot() {
  const wrap = useRef<HTMLDivElement>(null);
  const [mv, setMv] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const capable = window.matchMedia('(min-width: 1024px) and (hover: hover)').matches && !reducedMotion() && !conn?.saveData;
    if (!capable) return;
    const start = () => import('@google/model-viewer').then(() => setMv(true)).catch(() => {});
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const h = ric ? ric(start, { timeout: 2500 }) : window.setTimeout(start, 1200);
    return () => { if (!ric) clearTimeout(h); };
  }, []);

  // Maskot menoleh mengikuti pointer (mikro-interaksi), di-throttle oleh rAF
  useEffect(() => {
    if (!mv) return;
    const el = wrap.current?.querySelector('model-viewer') as (HTMLElement & { cameraOrbit?: string }) | null;
    if (!el) return;
    const onLoad = () => setLoaded(true);
    el.addEventListener('load', onLoad);
    let raf = 0;
    const move = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.setAttribute('camera-orbit', `${(-18 - x * 40).toFixed(1)}deg ${(82 + y * 10).toFixed(1)}deg 105%`);
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { el.removeEventListener('load', onLoad); window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, [mv]);

  return (
    <div ref={wrap} className="relative w-full h-full lp-float">
      <img src={`${BRAND}ryan-vox-poster.webp`} alt="Ryan Vox, the VoxAudit robot mascot" width={560} height={942}
        {...{ fetchpriority: 'high' }} decoding="async"
        className={`absolute inset-0 m-auto h-full w-auto object-contain transition-opacity duration-700 ${loaded ? 'opacity-0' : 'opacity-100'}`} />
      {mv && createElement('model-viewer', {
        src: `${BRAND}ryan-vox.glb`, alt: '', 'aria-hidden': 'true',
        'camera-orbit': '-18deg 82deg 105%', 'field-of-view': '26deg', 'interaction-prompt': 'none',
        'disable-zoom': true, 'disable-pan': true, exposure: '1.05', 'environment-image': 'neutral',
        'interpolation-decay': '120',
        style: { position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', opacity: loaded ? 1 : 0, transition: 'opacity .7s' },
      })}
    </div>
  );
}

function EvidenceChip({ kind, label, className, delay }: { kind: 'measured' | 'estimated' | 'ai'; label: string; className: string; delay: string }) {
  const swatch = kind === 'measured'
    ? <span className="w-2.5 h-2.5 rounded-sm bg-white" />
    : kind === 'estimated'
      ? <span className="w-2.5 h-2.5 rounded-sm border border-white/70 hatch text-white/70" />
      : <span className="w-2.5 h-2.5 rounded-full bg-[#e979d1]" />;
  return (
    <span style={{ ['--d' as string]: delay }}
      className={`lp-chip absolute z-20 hidden md:inline-flex items-center gap-2 rounded-full bg-[#07061a]/70 backdrop-blur-md border border-white/15 px-3 py-1.5 text-[13px] text-white/85 lp-mono ${className}`}>
      <span aria-hidden="true">{swatch}</span>{label}
    </span>
  );
}

function Hero() {
  const c = useCopy();
  const p = useProto();
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref);
  const openDemo = () => { p.set('role', 'owner'); p.set('dashState', 'populated'); p.set('signedIn', true); navigate(homePath('owner')); };

  return (
    <section id="top" ref={ref} className="relative min-h-[calc(100svh-64px)] flex flex-col" aria-labelledby="hero-title">
      {/* Wordmark raksasa di belakang maskot, bergeser pelan saat scroll */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[6%] lg:top-[4%] flex justify-center select-none"
        style={{ transform: 'translate3d(0, calc(var(--p, 0) * 120px), 0)' }}>
        <span dir="ltr" className="lp-display lp-outline font-black leading-none text-[26vw] lg:text-[19vw]">VOXAUDIT</span>
      </div>
      {/* Satu cahaya bara rendah — bukan blob ungu */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
        style={{ background: 'radial-gradient(60% 70% at 50% 100%, rgb(255 90 31 / 0.22), transparent 70%)' }} />

      <div className="relative flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-8 items-center pt-8 lg:pt-0">
        <div className="lg:col-span-5 relative z-10 space-y-7">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[13px] text-white/75" data-reveal>
            <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--ember))]" aria-hidden="true" />{c.heroKicker}
          </p>
          <h1 id="hero-title" className="lp-display font-extrabold text-[40px] leading-[1.03] sm:text-6xl xl:text-[68px]" data-reveal style={{ ['--d' as string]: '80ms' }}>
            {c.heroTitleA} <span className="text-[rgb(var(--ember))]">{c.heroTitleB}</span> {c.heroTitleC}
          </h1>
          <p className="text-[17px] leading-relaxed text-white/70 max-w-lg" data-reveal style={{ ['--d' as string]: '160ms' }}>{c.heroBody}</p>
          <div className="space-y-4" data-reveal style={{ ['--d' as string]: '240ms' }}>
            <AuditForm id="hero-url" />
            <button type="button" onClick={openDemo} className="text-[15px] font-semibold text-white/80 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-[rgb(var(--ember))]">
              {c.heroDemo}
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 relative h-[40svh] sm:h-[50svh] lg:h-[74svh]">
          <HeroMascot />
          <EvidenceChip kind="measured" label={c.chipMeasured} className="top-[18%] -start-4 xl:-start-10" delay="0s" />
          <EvidenceChip kind="estimated" label={c.chipEstimated} className="top-[48%] -end-6 xl:-end-16" delay="-3s" />
          <EvidenceChip kind="ai" label={c.chipAi} className="bottom-[14%] start-0" delay="-6s" />
        </div>

        <div className="lg:col-span-3 relative z-10 hidden lg:flex flex-col items-end text-end gap-2" data-reveal style={{ ['--d' as string]: '320ms' }}>
          <p className="lp-display font-black text-[120px] leading-none tracking-tighter"><Ltr>04</Ltr></p>
          <p className="text-white/60 max-w-[200px]">{c.heroStatLabel}</p>
          <div className="mt-4 flex gap-1.5 flex-wrap justify-end">
            {['VoxSEO', 'VoxSocial', 'VoxAI', 'Journey'].map((m) => (
              <span key={m} className="rounded-full border border-white/15 px-2.5 py-1 text-[12px] text-white/70 lp-mono">{m}</span>
            ))}
          </div>
        </div>
      </div>

      <a href="#statement" className="relative hidden lg:flex mx-auto mb-6 items-center gap-2 text-[13px] text-white/50 hover:text-white lp-mono">
        {c.heroScroll}<ArrowDown className="w-4 h-4 animate-bounce motion-reduce:animate-none" aria-hidden="true" />
      </a>

      <div className="relative border-y border-white/10 py-5">
        <p className="sr-only">{c.sourcesLabel}</p>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 flex items-center gap-6">
          <span className="hidden md:block shrink-0 lp-mono text-[12px] uppercase text-white/45">{c.sourcesLabel}</span>
          <div className="lp-marquee overflow-hidden flex-1" aria-hidden="true" dir="ltr">
            <div className="lp-marquee-track flex w-max gap-12">
              {[...c.sources, ...c.sources].map((s, i) => (
                <span key={i} className="text-white/55 text-[17px] font-semibold whitespace-nowrap">{s}</span>
              ))}
            </div>
          </div>
        </div>
        <ul className="sr-only">{c.sources.map((s) => <li key={s}>{s}</li>)}</ul>
      </div>
    </section>
  );
}

/* ---------------- Pernyataan yang menyala saat scroll ---------------- */

function Statement() {
  const c = useCopy();
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref);
  const words = c.statement.split(' ');
  return (
    <section id="statement" ref={ref} className="relative h-[170vh]" aria-label={c.statement}>
      <div className="sticky top-16 h-[calc(100vh-64px)] flex items-center">
        <p className="max-w-[1100px] mx-auto px-4 sm:px-6 lp-display font-bold text-[30px] leading-[1.18] sm:text-5xl lg:text-[64px]" aria-hidden="true"
          style={{ ['--n' as string]: words.length }}>
          {words.map((w, i) => (
            <span key={i} className="lp-word" style={{ ['--i' as string]: i }}>
              {/VoxAudit/.test(w) ? <span className="text-[rgb(var(--ember))]">{w}</span> : w}{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

/* ---------------- Empat pilar ---------------- */

function PillarVisual({ i }: { i: number }) {
  if (i === 0) {
    const rows = [['/book-appointment', 'noindex', '#ff5a5a'], ['/ar/services', 'hreflang missing', '#ffb020'], ['/', 'LCP 4.1 s', '#ffb020'], ['/contact', 'OK', '#3ddc84']];
    return (
      <ul className="space-y-2 lp-mono text-[13px]" dir="ltr">
        {rows.map(([u, s, col], k) => (
          <li key={u} className="lp-pop flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] border border-white/[0.07] px-3 py-2" style={{ ['--d' as string]: `${k * 110}ms` }}>
            <span className="text-white/75 truncate">{u}</span>
            <span className="flex items-center gap-1.5 shrink-0" style={{ color: col }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: col }} />{s}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (i === 1) {
    const qs = ['How much is whitening?', 'Do you open on Friday?', 'Can I book online?'];
    return (
      <div className="space-y-2">
        {qs.map((q, k) => (
          <p key={q} dir="ltr" className={`lp-pop max-w-[85%] rounded-2xl px-3.5 py-2 text-[14px] ${k % 2 ? 'ms-auto bg-[rgb(var(--ember))]/15 text-[#ffb08a]' : 'bg-white/[0.06] text-white/80'}`}
            style={{ ['--d' as string]: `${k * 140}ms` }}>{q}</p>
        ))}
        <p className="lp-pop lp-mono text-[12px] text-white/50 pt-1" style={{ ['--d' as string]: '480ms' }}><Ltr>31%</Ltr> of comments ask about price or availability · sample</p>
      </div>
    );
  }
  if (i === 2) {
    return (
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5 space-y-3" dir="ltr">
        <p className="lp-pop text-[14px] text-white/80" style={{ ['--d' as string]: '0ms' }}>“Best family dentist in Amman?”</p>
        <div className="space-y-1.5">
          {[0.92, 0.78, 0.6].map((w, k) => <div key={k} className="lp-grow h-2 rounded bg-white/15" style={{ ['--w' as string]: w, ['--d' as string]: `${150 + k * 120}ms` }} />)}
        </div>
        <div className="flex gap-4 lp-mono text-[12px]">
          <span className="lp-pop text-white/60" style={{ ['--d' as string]: '520ms' }}>Readiness <b className="text-white">55</b></span>
          <span className="lp-pop text-white/60" style={{ ['--d' as string]: '620ms' }}>Observed <b className="text-white/45">— not run</b></span>
        </div>
      </div>
    );
  }
  const steps = [['Visit', 1], ['Services', 0.72], ['Booking', 0.38], ['Confirmed', 0.16]] as const;
  return (
    <ul className="space-y-2" dir="ltr">
      {steps.map(([s, w], k) => (
        <li key={s} className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-[13px] text-white/60">{s}</span>
          <span className="flex-1 h-5 rounded bg-white/[0.05] overflow-hidden">
            <span className={`lp-grow block h-full rounded ${k === 2 ? 'bg-[rgb(var(--ember))]' : 'bg-white/25'} ${k === 3 ? 'hatch text-white/40 bg-transparent border border-white/25' : ''}`}
              style={{ ['--w' as string]: w, ['--d' as string]: `${k * 140}ms` }} />
          </span>
        </li>
      ))}
      <li className="lp-pop lp-mono text-[12px] text-white/50 pt-1" style={{ ['--d' as string]: '600ms' }}>Hypothesis until analytics is connected</li>
    </ul>
  );
}

function PillarCard({ i, name, benefit, detail }: { i: number; name: string; benefit: string; detail: string }) {
  const ref = useRef<HTMLElement>(null);
  usePointerTilt(ref, 5);
  return (
    <article ref={ref} className="lp-card p-6 sm:p-7 flex flex-col gap-6 min-h-[360px]" data-reveal style={{ ['--d' as string]: `${(i % 2) * 120}ms` }}>
      <div className="flex items-center justify-between">
        <span className="lp-mono text-[13px] text-white/50"><Ltr>0{i + 1}</Ltr></span>
        <span className="lp-mono text-[13px] rounded-full border border-white/15 px-2.5 py-0.5 text-white/75">{name}</span>
      </div>
      <div className="flex-1"><PillarVisual i={i} /></div>
      <div className="space-y-2">
        <h3 className="lp-display font-bold text-2xl leading-tight">{benefit}</h3>
        <p className="text-white/60 leading-relaxed">{detail}</p>
      </div>
    </article>
  );
}

function Pillars() {
  const c = useCopy();
  return (
    <section id="product" className="max-w-[1320px] mx-auto px-4 sm:px-6 py-24 lg:py-32 space-y-12" aria-labelledby="pillars-title">
      <div className="grid lg:grid-cols-12 gap-6 items-end">
        <div className="lg:col-span-7 space-y-5">
          <Kicker>{c.pillarsKicker}</Kicker>
          <h2 id="pillars-title" className="lp-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.04]" data-reveal>{c.pillarsTitle}</h2>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 lg:gap-5">
        {c.pillars.map((p, i) => <PillarCard key={p.name} i={i} {...p} />)}
      </div>
    </section>
  );
}

/* ---------------- Cerita scroll: satu lingkaran kerja ---------------- */

function StoryMock({ step }: { step: number }) {
  const stages = [['Website crawl', 'done'], ['Search visibility', 'done'], ['Social public data', 'run'], ['Google Business Profile', 'fail'], ['AI readiness', 'wait']] as const;
  const views = ['Executive', 'Marketing', 'Technical'];
  const [view, setView] = useState(0);
  useEffect(() => {
    if (step !== 2 || reducedMotion()) return;
    const t = setInterval(() => setView((v) => (v + 1) % 3), 1600);
    return () => clearInterval(t);
  }, [step]);

  return (
    <div className="rounded-[26px] bg-[#f6f7f9] text-[#14161c] p-5 sm:p-6 shadow-[0_40px_120px_-40px_rgba(255,90,31,0.45)] min-h-[380px]" dir="ltr">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-semibold text-[#545a68]">Cedar &amp; Co. Dental · sample</span>
        <span className="lp-mono text-[12px] rounded-full bg-white border border-[#dfe2e8] px-2 py-0.5 text-[#545a68]">run-0412 · v2.1</span>
      </div>

      <div key={step} className="animate-[fadeIn_.5s_ease]">
        {step === 0 && (
          <ol className="divide-y divide-[#dfe2e8] rounded-xl border border-[#dfe2e8] bg-white">
            {stages.map(([s, st]) => (
              <li key={s} className="flex items-center gap-3 px-4 py-3 text-[15px]">
                {st === 'done' && <CheckCircle2 className="w-5 h-5 text-[#1a7f37]" aria-hidden="true" />}
                {st === 'run' && <Loader2 className="w-5 h-5 text-[#0094ea] animate-spin motion-reduce:animate-none" aria-hidden="true" />}
                {st === 'fail' && <XCircle className="w-5 h-5 text-[#c4202c]" aria-hidden="true" />}
                {st === 'wait' && <Circle className="w-5 h-5 text-[#545a68]" aria-hidden="true" />}
                <span className="flex-1">{s}</span>
                {st === 'fail' && <span className="text-[13px] font-semibold rounded-md border border-[#dfe2e8] px-2 py-0.5">Retry</span>}
              </li>
            ))}
          </ol>
        )}
        {step === 1 && (
          <div className="rounded-xl border border-[#dfe2e8] bg-white p-5 space-y-4">
            <div className="flex flex-wrap gap-2 text-[12px] font-semibold">
              <span className="rounded-md bg-[#fde9ea] text-[#c4202c] px-1.5 py-0.5">Critical</span>
              <span className="rounded-md bg-[#f0f2f5] border border-[#dfe2e8] px-1.5 py-0.5">Measured</span>
              <span className="lp-mono rounded-md bg-[#f0f2f5] px-1.5 py-0.5">/book-appointment</span>
            </div>
            <p className="text-xl font-semibold leading-snug">Booking page is blocked from search engines (noindex)</p>
            <p className="text-[#545a68]">Found 12 Oct 2026 in the page header. Evidence preserved; edits are logged.</p>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#006fb0] text-white px-3 h-9 text-sm font-semibold"><Check className="w-4 h-4" aria-hidden="true" />Accept</span>
              <span className="inline-flex items-center rounded-lg border border-[#dfe2e8] px-3 h-9 text-sm font-semibold">Correct</span>
              <span className="inline-flex items-center rounded-lg px-3 h-9 text-sm font-semibold text-[#545a68]">Dismiss</span>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[#e9ebef]">
              {views.map((v, k) => (
                <span key={v} className={`text-center h-9 leading-9 rounded-md text-sm font-semibold transition-colors ${view === k ? 'bg-white shadow-sm' : 'text-[#545a68]'}`}>{v}</span>
              ))}
            </div>
            <div className="rounded-xl border border-[#dfe2e8] bg-white p-5 min-h-[180px]">
              {view === 0 && <p className="text-lg leading-relaxed">Patients can’t find the booking page in search. Fixing it is the fastest route to more appointments this month.</p>}
              {view === 1 && <p className="text-lg leading-relaxed">Add a booking link to the Instagram bio and pin one post answering price questions — 31% of comments ask.</p>}
              {view === 2 && <p className="lp-mono text-[14px] leading-relaxed">Remove <b>&lt;meta name="robots" content="noindex"&gt;</b> from /book-appointment; resubmit sitemap; verify in Search Console.</p>}
            </div>
            <p className="text-[13px] text-[#545a68]">Same finding f-101, three depths.</p>
          </div>
        )}
        {step === 3 && (
          <div className="rounded-xl border border-[#dfe2e8] bg-white divide-y divide-[#dfe2e8]">
            {[['Technical SEO fix', 'f-101, f-103'], ['Instagram booking funnel', 'f-102'], ['AI-ready FAQ + schema', 'f-104']].map(([s, f]) => (
              <div key={s} className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div><p className="font-semibold">{s}</p><p className="lp-mono text-[12px] text-[#545a68]">from {f}</p></div>
                <span className="text-[13px] text-[#545a68]">your catalog price</span>
              </div>
            ))}
            <div className="px-4 py-3.5 flex items-center justify-between"><span className="font-semibold">Send for approval</span><span className="rounded-lg bg-[#006fb0] text-white px-3 h-9 leading-9 text-sm font-semibold">Share link</span></div>
          </div>
        )}
      </div>
    </div>
  );
}

function Story() {
  const c = useCopy();
  const ref = useRef<HTMLDivElement>(null);
  const step = useScrollProgress(ref, 4);
  return (
    <section id="how" aria-labelledby="story-title" className="border-t border-white/10">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 pt-24 lg:pt-32 space-y-5">
        <Kicker>{c.storyKicker}</Kicker>
        <h2 id="story-title" className="lp-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.04] max-w-3xl" data-reveal>{c.storyTitle}</h2>
      </div>

      {/* Desktop: panel sticky; langkah berganti sesuai posisi scroll */}
      <div ref={ref} className="hidden lg:block relative h-[340vh]">
        <div className="sticky top-16 h-[calc(100vh-64px)] max-w-[1320px] mx-auto px-6 grid grid-cols-12 gap-10 items-center">
          <ol className="col-span-5 space-y-2">
            {c.steps.map((s, i) => (
              <li key={s.n} className={`rounded-2xl p-5 transition-all duration-500 ${step === i ? 'bg-white/[0.05] border border-white/10' : 'opacity-45 border border-transparent'}`}
                aria-current={step === i ? 'step' : undefined}>
                <div className="flex items-baseline gap-4">
                  <span className={`lp-mono text-[14px] ${step === i ? 'text-[rgb(var(--ember))]' : 'text-white/50'}`}><Ltr>{s.n}</Ltr></span>
                  <div>
                    <h3 className="lp-display font-bold text-2xl">{s.title}</h3>
                    <p className={`text-white/65 leading-relaxed overflow-hidden transition-all duration-500 ${step === i ? 'max-h-32 mt-2' : 'max-h-0'}`}>{s.body}</p>
                  </div>
                </div>
              </li>
            ))}
            <li aria-hidden="true" className="pt-4 ps-5">
              <div className="h-[2px] w-full bg-white/10 rounded overflow-hidden">
                <div className="h-full bg-[rgb(var(--ember))] origin-left rtl:origin-right" style={{ transform: 'scaleX(var(--p, 0))' }} />
              </div>
            </li>
          </ol>
          <div className="col-span-7"><StoryMock step={step} /></div>
        </div>
      </div>

      {/* Mobile/tablet: tumpukan sederhana, tanpa scroll-jacking */}
      <ol className="lg:hidden max-w-[1320px] mx-auto px-4 sm:px-6 py-12 space-y-12">
        {c.steps.map((s, i) => (
          <li key={s.n} className="space-y-4" data-reveal>
            <div className="flex items-baseline gap-3">
              <span className="lp-mono text-[14px] text-[rgb(var(--ember))]"><Ltr>{s.n}</Ltr></span>
              <h3 className="lp-display font-bold text-2xl">{s.title}</h3>
            </div>
            <p className="text-white/65 leading-relaxed">{s.body}</p>
            <StoryMock step={i} />
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------------- Bukti (kanvas terang) ---------------- */

function EvidenceChart() {
  const c = useCopy();
  const [active, setActive] = useState<number | null>(0);
  const data = [
    { name: c.chartClient, v: 18, est: false, client: true },
    { name: 'Juniper Smile Studio', v: 31, est: false },
    { name: 'Harbor Dental Group', v: 24, est: false },
    { name: 'Aldara Family Dentistry', v: 12, est: true },
  ];
  return (
    <figure className="rounded-[26px] bg-white border border-[#dfe2e8] p-6 sm:p-8 shadow-[0_30px_80px_-40px_rgba(16,24,40,0.35)]" data-reveal>
      <figcaption className="mb-6">
        <p className="font-semibold text-lg">{c.chartTitle}</p>
        <p className="text-[#545a68]">{c.chartSub}</p>
      </figcaption>
      <ul className="space-y-5">
        {data.map((d, i) => (
          <li key={d.name}>
            <button type="button" onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}
              aria-expanded={active === i} className="w-full text-start group">
              <span className="flex items-center justify-between gap-3 mb-2">
                <span className={`truncate ${d.client ? 'font-semibold' : 'text-[#545a68]'}`}>{d.name}</span>
                <span className="flex items-center gap-2 shrink-0">
                  {d.est && <span className="rounded border border-dashed border-[#545a68]/60 px-1.5 text-[12px] text-[#545a68]">Est.</span>}
                  <span className="font-semibold num"><Ltr>{d.est ? '~' : ''}{d.v}%</Ltr></span>
                </span>
              </span>
              <span className="block h-4 rounded bg-[#f0f2f5] overflow-hidden">
                <span className={`lp-grow block h-full rounded ${d.client ? 'bg-[#0094ea]' : d.est ? 'hatch text-[#545a68]/60 border border-[#545a68]/40' : 'bg-[#545a68]/45 group-hover:bg-[#545a68]/60'}`}
                  style={{ ['--w' as string]: d.v / 31, ['--d' as string]: `${i * 120}ms` }} />
              </span>
            </button>
            <p className={`lp-mono text-[13px] text-[#545a68] overflow-hidden transition-all duration-300 ${active === i ? 'max-h-10 mt-2 opacity-100' : 'max-h-0 opacity-0'}`} aria-live="polite">
              {d.est ? c.srcEstimated : c.srcMeasured}
            </p>
          </li>
        ))}
      </ul>
    </figure>
  );
}

function Evidence() {
  const c = useCopy();
  return (
    <section id="evidence" aria-labelledby="evidence-title" className="bg-[#f6f7f9] text-[#14161c] rounded-t-[36px] sm:rounded-t-[56px]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-24 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <p className="lp-mono text-[13px] uppercase text-[#545a68] flex items-center gap-3" data-reveal><LogoBars />{c.evidenceKicker}</p>
          <h2 id="evidence-title" className="lp-display font-extrabold text-4xl sm:text-5xl lg:text-[64px] leading-[1.02]" data-reveal>{c.evidenceTitle}</h2>
          <p className="text-[17px] text-[#545a68] leading-relaxed" data-reveal>{c.evidenceBody}</p>
          <ul className="space-y-5 pt-2">
            {c.evidencePoints.map((pt, i) => (
              <li key={pt.t} className="flex gap-4" data-reveal style={{ ['--d' as string]: `${i * 90}ms` }}>
                <span className="lp-mono text-[13px] text-[#c2410c] pt-1"><Ltr>0{i + 1}</Ltr></span>
                <div><p className="font-semibold text-lg">{pt.t}</p><p className="text-[#545a68] mt-1">{pt.d}</p></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7"><EvidenceChart /></div>
      </div>
    </section>
  );
}

/* ---------------- Untuk siapa ---------------- */

function Who() {
  const c = useCopy();
  const [tab, setTab] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent) => {
    const dir = (e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0) * (document.documentElement.dir === 'rtl' ? -1 : 1);
    if (!dir) return;
    const next = (tab + dir + c.who.length) % c.who.length;
    setTab(next);
    tabsRef.current[next]?.focus();
  };
  const w = c.who[tab];
  return (
    <section id="who" aria-labelledby="who-title" className="bg-[#f6f7f9] text-[#14161c]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 pb-24 lg:pb-32 space-y-10">
        <div className="space-y-5">
          <p className="lp-mono text-[13px] uppercase text-[#545a68] flex items-center gap-3" data-reveal><LogoBars />{c.whoKicker}</p>
          <h2 id="who-title" className="lp-display font-extrabold text-4xl sm:text-5xl leading-[1.04] max-w-3xl" data-reveal>{c.whoTitle}</h2>
        </div>
        <div className="rounded-[26px] bg-[#07061a] text-white p-2 sm:p-3" data-reveal>
          <div role="tablist" aria-label={c.whoKicker} className="grid grid-cols-3 gap-1 p-1 rounded-[20px] bg-white/[0.05]" onKeyDown={onKey}>
            {c.who.map((x, i) => (
              <button key={x.tab} ref={(el) => { tabsRef.current[i] = el; }} type="button" role="tab" id={`who-tab-${i}`} aria-controls="who-panel"
                aria-selected={tab === i} tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)}
                className={`h-12 rounded-2xl text-[14px] sm:text-[15px] font-semibold transition-colors ${tab === i ? 'bg-[rgb(var(--ember))] text-[#07061a]' : 'text-white/70 hover:text-white'}`}>
                {x.tab}
              </button>
            ))}
          </div>
          <div id="who-panel" role="tabpanel" aria-labelledby={`who-tab-${tab}`} key={tab} className="grid md:grid-cols-2 gap-8 p-6 sm:p-10 animate-[fadeIn_.5s_ease]">
            <h3 className="lp-display font-bold text-3xl sm:text-4xl leading-tight">{w.title}</h3>
            <ul className="space-y-4">
              {w.points.map((pt) => (
                <li key={pt} className="flex gap-3 text-white/80 text-[17px]">
                  <Check className="w-5 h-5 mt-0.5 shrink-0 text-[rgb(var(--ember))]" aria-hidden="true" />{pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Arab lebih dulu ---------------- */

function ReportFace({ lang }: { lang: 'en' | 'ar' }) {
  const ar = lang === 'ar';
  return (
    <div dir={ar ? 'rtl' : 'ltr'} lang={lang} className={`rounded-[22px] bg-white text-[#14161c] p-6 h-full ${ar ? 'font-arabic' : ''}`}>
      <p className="text-[13px] text-[#545a68]">{ar ? 'تقرير النمو · عرض تنفيذي' : 'Growth report · Executive view'}</p>
      <p className="text-2xl font-bold mt-1">{ar ? 'سيدار آند كو لطب الأسنان' : 'Cedar & Co. Dental'}</p>
      <div className="flex items-baseline gap-2 mt-5">
        <span className="text-5xl font-bold num"><bdi dir="ltr">68</bdi></span>
        <span className="text-[#545a68] num"><bdi dir="ltr">/ 100</bdi></span>
        <span className="rounded-full bg-[#fff4d6] text-[#9a6700] px-2 py-0.5 text-[12px] font-semibold">{ar ? 'يحتاج إلى عمل' : 'Needs work'}</span>
      </div>
      <div className="flex items-center gap-2 mt-2 text-[13px] text-[#545a68]">
        <span className="h-1.5 w-20 rounded-full bg-[#f0f2f5] overflow-hidden"><span className="block h-full w-[78%] bg-[#14161c]/70" /></span>
        <bdi dir="ltr">78%</bdi> {ar ? 'تغطية' : 'coverage'}
      </div>
      <p className="mt-5 ps-3 border-s-2 border-[#b02d95] leading-relaxed">
        {ar ? 'صفحة الحجز لا تظهر في البحث. إصلاحها أسرع طريق لمواعيد أكثر.' : 'The booking page can’t be found in search. Fixing it is the fastest route to more appointments.'}
      </p>
      <p className="mt-4 text-[13px] text-[#545a68]"><bdi dir="ltr" className="lp-mono">/book-appointment</bdi> · <bdi dir="ltr">12 Oct 2026</bdi></p>
    </div>
  );
}

function Bilingual() {
  const c = useCopy();
  const { lang } = useProto();
  const [flipped, setFlipped] = useState(lang === 'en');
  useEffect(() => setFlipped(lang === 'en'), [lang]);
  return (
    <section aria-labelledby="lang-title" className="bg-[#f6f7f9] text-[#14161c] pb-24 lg:pb-32">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <p className="lp-mono text-[13px] uppercase text-[#545a68] flex items-center gap-3" data-reveal><LogoBars />{c.langKicker}</p>
          <h2 id="lang-title" className="lp-display font-extrabold text-4xl sm:text-5xl leading-[1.04]" data-reveal>{c.langTitle}</h2>
          <p className="text-[17px] text-[#545a68] leading-relaxed max-w-lg" data-reveal>{c.langBody}</p>
          <button type="button" onClick={() => setFlipped((f) => !f)} className="lp-btn bg-[#07061a] text-white hover:bg-black" data-reveal aria-pressed={flipped}>
            {c.langToggle} <span className="text-white/60 font-medium">EN ⇄ ع</span>
          </button>
        </div>
        <div className="lg:col-span-6 [perspective:1400px]" data-reveal>
          <div className="lp-flip relative h-[340px] sm:h-[320px]" data-flipped={flipped}>
            <div className="lp-face absolute inset-0 shadow-[0_30px_80px_-40px_rgba(16,24,40,0.45)] rounded-[22px]"><ReportFace lang="ar" /></div>
            <div className="lp-face lp-face-back absolute inset-0 shadow-[0_30px_80px_-40px_rgba(16,24,40,0.45)] rounded-[22px]"><ReportFace lang="en" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Fakta produk + CTA akhir ---------------- */

function Fact({ n, l, i }: { n: number; l: string; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useCountUp(ref, n, 700 + i * 150);
  return (
    <div ref={ref} className="border-t border-white/15 pt-5" data-reveal style={{ ['--d' as string]: `${i * 90}ms` }}>
      <p className="lp-display font-black text-7xl lg:text-8xl leading-none tracking-tighter"><Ltr>{v}</Ltr></p>
      <p className="text-white/60 mt-3">{l}</p>
    </div>
  );
}

function Final() {
  const c = useCopy();
  return (
    <section aria-labelledby="final-title" className="relative">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-24 lg:py-32 space-y-16">
        <div className="space-y-8">
          <Kicker>{c.factsKicker}</Kicker>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {c.facts.map((f, i) => <Fact key={f.l} n={f.n} l={f.l} i={i} />)}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[32px] sm:rounded-[44px] bg-[rgb(var(--ember))] text-[#07061a] p-8 sm:p-14 lg:p-20" data-reveal>
          <span aria-hidden="true" dir="ltr" className="pointer-events-none absolute -bottom-[0.18em] -end-[0.05em] lp-display font-black text-[34vw] lg:text-[22vw] leading-none text-[#07061a]/[0.07] select-none">VOX</span>
          <div className="relative max-w-2xl space-y-6">
            <h2 id="final-title" className="lp-display font-extrabold text-4xl sm:text-6xl leading-[1.02]">{c.finalTitle}</h2>
            <p className="text-[17px] text-[#07061a]/75 max-w-lg">{c.finalBody}</p>
            <AuditForm id="final-url" tone="ember" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const c = useCopy();
  return (
    <footer className="border-t border-white/10">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row gap-6 md:items-center justify-between text-[14px] text-white/55">
        <div className="flex items-center gap-4">
          <img src={`${BRAND}voxaudit-logo-dark.png`} alt="VoxAudit by Voxlumedia" className="h-8 w-auto" />
          <span>{c.footerRights}</span>
        </div>
        <p className="max-w-md">{c.footerNote}</p>
        <ul className="flex gap-5">{c.footerLinks.map((l) => <li key={l}><a href={`#${l}`} className="hover:text-white">{l}</a></li>)}</ul>
      </div>
    </footer>
  );
}

export function Landing() {
  const root = useRef<HTMLDivElement>(null);
  const { lang } = useProto();
  useReveal(root, lang);
  useEffect(() => { document.title = 'VoxAudit Intelligence — Growth audits you can prove'; }, []);
  return (
    <div ref={root} key={lang} className="lp min-h-screen">
      <SampleBanner />
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Pillars />
        <Story />
        <Evidence />
        <Who />
        <Bilingual />
        <Final />
      </main>
      <Footer />
    </div>
  );
}
