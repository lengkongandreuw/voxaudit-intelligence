import { createElement, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Menu, X, Link2, Move3d, Loader2, CheckCircle2, XCircle, Circle } from 'lucide-react';
import { useProto } from '../lib/prototype';
import { LANDING } from '../lib/landing-copy';
import { homePath } from '../lib/workspace';
import { reducedMotion, useCountUp, useMagnetic, usePointerTilt, useReveal, useScrollProgress } from '../lib/motion';
import { Ltr } from '../components/ui';

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
      <div className={`flex flex-col sm:flex-row gap-2 p-1.5 rounded-[2px] sm:rounded-[2px] border transition-colors
        ${onEmber ? 'bg-[#07061a]/10 border-[#07061a]/20 focus-within:border-[#07061a]/60' : 'bg-[#0d0c28]/85 backdrop-blur-md border-white/15 focus-within:border-[rgb(var(--ember))]'}`}>
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
            className="h-10 px-3 rounded-[2px] text-[14px] text-white/70 hover:text-white border border-white/15">
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

/**
 * Ryan setengah badan di bawah judul. Poster langsung tampil (LCP ringan);
 * model 3D dimuat saat idle, juga di ponsel (kecuali Save-Data / kurangi gerakan).
 * Yang diputar modelnya (orientation), bukan kamera:
 * - desktop: menoleh ke arah kursor;
 * - semua perangkat: bisa diseret untuk diputar, lalu kembali pelan;
 * - layar sentuh tanpa kursor: bergoyang pelan agar kedalaman 3D-nya terlihat.
 * Framing kamera per ukuran layar harus sama dengan poster yang dirender.
 */
const MAX_YAW = 30;   // derajat ke kiri/kanan saat mengikuti kursor
const MAX_PITCH = 8;  // derajat ke atas/bawah
const CAM = {
  wide: { orbit: '0deg 84deg 1.45m', target: '0m 0.67m 0m', fov: '29deg' },
  narrow: { orbit: '0deg 84deg 1.7m', target: '0m 0.68m 0m', fov: '35deg' },
};

function HeroMascot() {
  const c = useCopy();
  const stage = useRef<HTMLDivElement>(null);
  const [mv, setMv] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 1024px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reducedMotion() || conn?.saveData) return () => mq.removeEventListener('change', on);
    const start = () => import('@google/model-viewer').then(() => setMv(true)).catch(() => {});
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const h = ric ? ric(start, { timeout: 2500 }) : window.setTimeout(start, 1200);
    return () => { mq.removeEventListener('change', on); if (!ric) clearTimeout(h); };
  }, []);

  useEffect(() => {
    const el = stage.current;
    if (!el || reducedMotion()) return;
    const model = mv ? el.querySelector('model-viewer') : null;
    const onLoad = () => setLoaded(true);
    model?.addEventListener('load', onLoad);
    const hover = window.matchMedia('(hover: hover)').matches;

    const target = { yaw: 0, pitch: 0, spin: 0 };
    const cur = { yaw: 0, pitch: 0, spin: 0 };
    let drag: { x: number; spin: number; id: number } | null = null;
    let visible = true;
    let raf = 0;
    const tick = (t: number) => {
      if (!hover && !drag) target.yaw = Math.sin(t / 1600) * 18;   // goyang pelan di layar sentuh
      cur.yaw += (target.yaw - cur.yaw) * 0.08;
      cur.pitch += (target.pitch - cur.pitch) * 0.08;
      cur.spin += (target.spin - cur.spin) * (drag ? 0.35 : 0.06);
      const yaw = cur.yaw + cur.spin;
      model?.setAttribute('orientation', `0deg ${cur.pitch.toFixed(2)}deg ${yaw.toFixed(2)}deg`);
      el.style.setProperty('--mx', (-yaw / MAX_YAW).toFixed(3));
      el.style.setProperty('--my', (-cur.pitch / MAX_PITCH).toFixed(3));
      const settled = hover && !drag && Math.abs(target.yaw - cur.yaw) < 0.05 && Math.abs(target.pitch - cur.pitch) < 0.05 && Math.abs(target.spin - cur.spin) < 0.05;
      raf = settled || !visible ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf && visible) raf = requestAnimationFrame(tick); };
    const move = (e: PointerEvent) => {
      if (drag && e.pointerId === drag.id) { target.spin = drag.spin + (e.clientX - drag.x) * 0.45; kick(); return; }
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      // Posisi kursor relatif ke pusat kepala Ryan, dinormalisasi -1..1
      const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.35)) / (window.innerHeight / 2)));
      target.yaw = nx * MAX_YAW;
      target.pitch = ny * MAX_PITCH;
      kick();
    };
    const down = (e: PointerEvent) => { drag = { x: e.clientX, spin: target.spin, id: e.pointerId }; kick(); };
    const up = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      drag = null;
      // Kembali ke depan lewat jalur terpendek
      const turns = Math.round(cur.spin / 360) * 360;
      cur.spin -= turns; target.spin = 0; kick();
    };
    const reset = () => { if (hover) { target.yaw = 0; target.pitch = 0; kick(); } };
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; kick(); });
    io.observe(el);
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    document.documentElement.addEventListener('pointerleave', reset);
    kick();
    return () => {
      model?.removeEventListener('load', onLoad);
      io.disconnect();
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      document.documentElement.removeEventListener('pointerleave', reset);
      cancelAnimationFrame(raf);
    };
  }, [mv]);

  const cam = wide ? CAM.wide : CAM.narrow;
  return (
    <div ref={stage} className={`lp-stage relative w-full mx-auto select-none max-w-[560px] aspect-[39/50] lg:max-w-[1440px] lg:aspect-[1440/760] ${mv ? '' : 'cursor-auto'}`}>
      <picture>
        <source media="(min-width: 1024px)" srcSet={`${BRAND}ryan-hero-wide.webp`} width={1440} height={760} />
        <img src={`${BRAND}ryan-hero-narrow.webp`} width={780} height={1000} alt="Ryan Vox, the VoxAudit mascot, giving two thumbs up"
          {...{ fetchpriority: 'high' }} decoding="async" draggable={false}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${loaded ? 'opacity-0' : 'opacity-100'}`} />
      </picture>
      {mv && createElement('model-viewer', {
        src: `${BRAND}ryan-vox-2.glb`, alt: '', 'aria-hidden': 'true',
        'camera-orbit': cam.orbit, 'camera-target': cam.target, 'field-of-view': cam.fov,
        'min-camera-orbit': 'auto auto 0.3m', 'min-field-of-view': '10deg',
        'interaction-prompt': 'none', exposure: '1.1', 'environment-image': 'neutral', 'shadow-intensity': '0',
        style: { position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', opacity: loaded ? 1 : 0, transition: 'opacity .7s', pointerEvents: 'none' },
      })}

      {/* Properti tambahan (CSS) di kedalaman berbeda — ikut bergeser saat Ryan berputar */}
      <div aria-hidden="true" className="hidden lg:block">
        <span className="lp-prop end-[10%] top-[14%]" style={{ ['--z' as string]: '26px' }}>
          <span className="grid place-items-center w-[118px] h-[96px] rounded-[2px] border border-white/30 text-white backdrop-blur-sm"
            style={{ background: 'linear-gradient(140deg, rgb(80 140 255 / .55), rgb(37 99 235 / .25))', transform: 'perspective(600px) rotateY(-22deg) rotateX(12deg) rotateZ(-8deg)', boxShadow: '0 20px 60px rgb(47 107 255 / .35), inset 0 1px 0 rgb(255 255 255 / .5)' }}>
            <Link2 className="w-12 h-12 -rotate-45" strokeWidth={2.4} />
          </span>
        </span>
        <span className="lp-prop end-[6%] top-[50%]" style={{ ['--z' as string]: '40px', ['--d' as string]: '-3s' }}>
          <span className="block"><span className="lp-cube block" style={{ ['--s' as string]: '50px', ['--c1' as string]: '#2f6bff', ['--c2' as string]: '#1c47c9', ['--c3' as string]: '#6f9bff' }}><i /><i /><i /></span></span>
        </span>
        <span className="lp-prop start-[9%] top-[30%]" style={{ ['--z' as string]: '34px', ['--d' as string]: '-5s' }}>
          <span className="block"><span className="lp-cube block" style={{ ['--s' as string]: '46px', ['--c1' as string]: '#ff7a1a', ['--c2' as string]: '#d9480f', ['--c3' as string]: '#ffb020' }}><i /><i /><i /></span></span>
        </span>
      </div>

      {mv && loaded && (
        <p className="absolute bottom-5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-10 inline-flex items-center gap-2 rounded-[2px] bg-[#07061a]/70 backdrop-blur-md border border-white/15 px-3 py-1.5 text-[13px] text-white/80 lp-mono pointer-events-none" style={{ animation: 'fadeIn .6s both' }}>
          <Move3d className="w-4 h-4" aria-hidden="true" />{c.heroSpin}
        </p>
      )}
    </div>
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
    <section id="top" ref={ref} className="relative overflow-hidden flex flex-col min-h-[calc(100svh-64px)]" aria-labelledby="hero-title">
      {/* Busur cahaya oranye–biru + cahaya horizon di bawah */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-[28%] h-[60%]" style={{ background: 'radial-gradient(40% 50% at 50% 55%, rgb(47 107 255 / 0.22), transparent 70%)' }} />
        <span className="lp-arc lp-arc-glow w-[160vw] lg:w-[118vw] aspect-[2/1] top-[50%] lg:top-[48%]" />
        <span className="lp-arc w-[160vw] lg:w-[118vw] aspect-[2/1] top-[50%] lg:top-[48%]" style={{ ['--t' as string]: '2px' }} />
        <span className="lp-arc w-[190vw] lg:w-[140vw] aspect-[2/1] top-[58%] lg:top-[58%] opacity-40" style={{ ['--t' as string]: '1.5px' }} />
        <div className="absolute inset-x-0 bottom-0 h-[40%]" style={{ background: 'radial-gradient(35% 60% at 0% 100%, rgb(255 90 31 / 0.35), transparent 70%), radial-gradient(35% 60% at 100% 100%, rgb(255 90 31 / 0.3), transparent 70%)' }} />
      </div>

      <div className="relative z-20 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-10 flex flex-col items-center text-center gap-5">
        <p className="inline-flex items-center gap-2 rounded-[2px] border border-white/15 bg-white/[0.04] backdrop-blur-sm px-3 py-1.5 text-[13px] text-white/80" data-reveal>
          <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--ember))]" aria-hidden="true" />{c.heroKicker}
        </p>
        <h1 id="hero-title" className="lp-display font-extrabold text-[38px] leading-[1.04] sm:text-6xl xl:text-[66px]" data-reveal style={{ ['--d' as string]: '80ms' }}>
          {c.heroTitleA}<br className="hidden sm:block" /> <span className="text-[rgb(var(--ember))]">{c.heroTitleB}</span> {c.heroTitleC}
        </h1>
        <p className="text-[17px] leading-relaxed text-white/75 max-w-2xl" data-reveal style={{ ['--d' as string]: '160ms' }}>{c.heroBody}</p>
        <div className="w-full flex flex-col items-center gap-3" data-reveal style={{ ['--d' as string]: '240ms' }}>
          <AuditForm id="hero-url" />
          <button type="button" onClick={openDemo} className="text-[15px] font-semibold text-white/80 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-[rgb(var(--ember))]">
            {c.heroDemo}
          </button>
        </div>
      </div>

      {/* Maskot dominan, setengah badan terpotong tepi bawah hero */}
      <div className="relative flex-1 flex items-end -mt-16 lg:-mt-[40px]">
        <HeroMascot />
      </div>

      <div className="relative z-10 border-y border-white/10 py-5 bg-[#07061a]/80 backdrop-blur-md">
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
          <li key={u} className="lp-pop flex items-center justify-between gap-3 rounded-[2px] bg-white/[0.04] border border-white/[0.07] px-3 py-2" style={{ ['--d' as string]: `${k * 110}ms` }}>
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
          <p key={q} dir="ltr" className={`lp-pop max-w-[85%] rounded-[2px] px-3.5 py-2 text-[14px] ${k % 2 ? 'ms-auto bg-[rgb(var(--ember))]/15 text-[#ffb08a]' : 'bg-white/[0.06] text-white/80'}`}
            style={{ ['--d' as string]: `${k * 140}ms` }}>{q}</p>
        ))}
        <p className="lp-pop lp-mono text-[12px] text-white/50 pt-1" style={{ ['--d' as string]: '480ms' }}><Ltr>31%</Ltr> of comments ask about price or availability · sample</p>
      </div>
    );
  }
  if (i === 2) {
    return (
      <div className="rounded-[2px] border border-white/[0.08] bg-white/[0.03] p-3.5 space-y-3" dir="ltr">
        <p className="lp-pop text-[14px] text-white/80" style={{ ['--d' as string]: '0ms' }}>“Best family dentist in Amman?”</p>
        <div className="space-y-1.5">
          {[0.92, 0.78, 0.6].map((w, k) => <div key={k} className="lp-grow h-2 rounded-[2px] bg-white/15" style={{ ['--w' as string]: w, ['--d' as string]: `${150 + k * 120}ms` }} />)}
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
          <span className="flex-1 h-5 rounded-[2px] bg-white/[0.05] overflow-hidden">
            <span className={`lp-grow block h-full rounded-[2px] ${k === 2 ? 'bg-[rgb(var(--ember))]' : 'bg-white/25'} ${k === 3 ? 'hatch text-white/40 bg-transparent border border-white/25' : ''}`}
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
        <span className="lp-mono text-[13px] rounded-[2px] border border-white/15 px-2.5 py-0.5 text-white/75">{name}</span>
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
  const stages = [['Website crawl', 'done'], ['Search visibility', 'done'], ['Social public data', 'run'], ['Google Business Profile', 'fail'], ['Answer-engine readiness', 'wait']] as const;
  const views = ['Executive', 'Marketing', 'Technical'];
  const [view, setView] = useState(0);
  useEffect(() => {
    if (step !== 2 || reducedMotion()) return;
    const t = setInterval(() => setView((v) => (v + 1) % 3), 1600);
    return () => clearInterval(t);
  }, [step]);

  return (
    <div className="rounded-[2px] bg-[#f6f7f9] text-[#14161c] p-5 sm:p-6 shadow-[0_40px_120px_-40px_rgba(255,90,31,0.45)] min-h-[380px]" dir="ltr">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-semibold text-[#545a68]">Cedar &amp; Co. Dental · sample</span>
        <span className="lp-mono text-[12px] rounded-[2px] bg-white border border-[#dfe2e8] px-2 py-0.5 text-[#545a68]">run-0412 · v2.1</span>
      </div>

      <div key={step} className="animate-[fadeIn_.5s_ease]">
        {step === 0 && (
          <ol className="divide-y divide-[#dfe2e8] rounded-[2px] border border-[#dfe2e8] bg-white">
            {stages.map(([s, st]) => (
              <li key={s} className="flex items-center gap-3 px-4 py-3 text-[15px]">
                {st === 'done' && <CheckCircle2 className="w-5 h-5 text-[#1a7f37]" aria-hidden="true" />}
                {st === 'run' && <Loader2 className="w-5 h-5 text-[#0094ea] animate-spin motion-reduce:animate-none" aria-hidden="true" />}
                {st === 'fail' && <XCircle className="w-5 h-5 text-[#c4202c]" aria-hidden="true" />}
                {st === 'wait' && <Circle className="w-5 h-5 text-[#545a68]" aria-hidden="true" />}
                <span className="flex-1">{s}</span>
                {st === 'fail' && <span className="text-[13px] font-semibold rounded-[2px] border border-[#dfe2e8] px-2 py-0.5">Retry</span>}
              </li>
            ))}
          </ol>
        )}
        {step === 1 && (
          <div className="rounded-[2px] border border-[#dfe2e8] bg-white p-5 space-y-4">
            <div className="flex flex-wrap gap-2 text-[12px] font-semibold">
              <span className="rounded-[2px] bg-[#fde9ea] text-[#c4202c] px-1.5 py-0.5">Critical</span>
              <span className="rounded-[2px] bg-[#f0f2f5] border border-[#dfe2e8] px-1.5 py-0.5">Measured</span>
              <span className="lp-mono rounded-[2px] bg-[#f0f2f5] px-1.5 py-0.5">/book-appointment</span>
            </div>
            <p className="text-xl font-semibold leading-snug">Booking page is blocked from search engines (noindex)</p>
            <p className="text-[#545a68]">Found 12 Oct 2026 in the page header. Evidence preserved; edits are logged.</p>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-[2px] bg-[#006fb0] text-white px-3 h-9 text-sm font-semibold"><Check className="w-4 h-4" aria-hidden="true" />Accept</span>
              <span className="inline-flex items-center rounded-[2px] border border-[#dfe2e8] px-3 h-9 text-sm font-semibold">Correct</span>
              <span className="inline-flex items-center rounded-[2px] px-3 h-9 text-sm font-semibold text-[#545a68]">Dismiss</span>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-1 p-1 rounded-[2px] bg-[#e9ebef]">
              {views.map((v, k) => (
                <span key={v} className={`text-center h-9 leading-9 rounded-[2px] text-sm font-semibold transition-colors ${view === k ? 'bg-white shadow-sm' : 'text-[#545a68]'}`}>{v}</span>
              ))}
            </div>
            <div className="rounded-[2px] border border-[#dfe2e8] bg-white p-5 min-h-[180px]">
              {view === 0 && <p className="text-lg leading-relaxed">Patients can’t find the booking page in search. Fixing it is the fastest route to more appointments this month.</p>}
              {view === 1 && <p className="text-lg leading-relaxed">Add a booking link to the Instagram bio and pin one post answering price questions — 31% of comments ask.</p>}
              {view === 2 && <p className="lp-mono text-[14px] leading-relaxed">Remove <b>&lt;meta name="robots" content="noindex"&gt;</b> from /book-appointment; resubmit sitemap; verify in Search Console.</p>}
            </div>
            <p className="text-[13px] text-[#545a68]">Same finding f-101, three depths.</p>
          </div>
        )}
        {step === 3 && (
          <div className="rounded-[2px] border border-[#dfe2e8] bg-white divide-y divide-[#dfe2e8]">
            {[['Technical SEO fix', 'f-101, f-103'], ['Instagram booking funnel', 'f-102'], ['Answer-ready FAQ + schema', 'f-104']].map(([s, f]) => (
              <div key={s} className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div><p className="font-semibold">{s}</p><p className="lp-mono text-[12px] text-[#545a68]">from {f}</p></div>
                <span className="text-[13px] text-[#545a68]">your catalog price</span>
              </div>
            ))}
            <div className="px-4 py-3.5 flex items-center justify-between"><span className="font-semibold">Send for approval</span><span className="rounded-[2px] bg-[#006fb0] text-white px-3 h-9 leading-9 text-sm font-semibold">Share link</span></div>
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
              <li key={s.n} className={`rounded-[2px] p-5 transition-all duration-500 ${step === i ? 'bg-white/[0.05] border border-white/10' : 'opacity-45 border border-transparent'}`}
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
              <div className="h-[2px] w-full bg-white/10 rounded-[2px] overflow-hidden">
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
    <figure className="rounded-[2px] bg-white border border-[#dfe2e8] p-6 sm:p-8 shadow-[0_30px_80px_-40px_rgba(16,24,40,0.35)]" data-reveal>
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
                  {d.est && <span className="rounded-[2px] border border-dashed border-[#545a68]/60 px-1.5 text-[12px] text-[#545a68]">Est.</span>}
                  <span className="font-semibold num"><Ltr>{d.est ? '~' : ''}{d.v}%</Ltr></span>
                </span>
              </span>
              <span className="block h-4 rounded-[2px] bg-[#f0f2f5] overflow-hidden">
                <span className={`lp-grow block h-full rounded-[2px] ${d.client ? 'bg-[#0094ea]' : d.est ? 'hatch text-[#545a68]/60 border border-[#545a68]/40' : 'bg-[#545a68]/45 group-hover:bg-[#545a68]/60'}`}
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
    <section id="evidence" aria-labelledby="evidence-title" className="bg-[#f6f7f9] text-[#14161c]">
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
        <div className="rounded-[2px] bg-[#07061a] text-white p-2 sm:p-3" data-reveal>
          <div role="tablist" aria-label={c.whoKicker} className="grid grid-cols-3 gap-1 p-1 rounded-[2px] bg-white/[0.05]" onKeyDown={onKey}>
            {c.who.map((x, i) => (
              <button key={x.tab} ref={(el) => { tabsRef.current[i] = el; }} type="button" role="tab" id={`who-tab-${i}`} aria-controls="who-panel"
                aria-selected={tab === i} tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)}
                className={`h-12 rounded-[2px] text-[14px] sm:text-[15px] font-semibold transition-colors ${tab === i ? 'bg-[rgb(var(--ember))] text-[#07061a]' : 'text-white/70 hover:text-white'}`}>
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
    <div dir={ar ? 'rtl' : 'ltr'} lang={lang} className={`rounded-[2px] bg-white text-[#14161c] p-6 h-full ${ar ? 'font-arabic' : ''}`}>
      <p className="text-[13px] text-[#545a68]">{ar ? 'تقرير النمو · عرض تنفيذي' : 'Growth report · Executive view'}</p>
      <p className="text-2xl font-bold mt-1">{ar ? 'سيدار آند كو لطب الأسنان' : 'Cedar & Co. Dental'}</p>
      <div className="flex items-baseline gap-2 mt-5">
        <span className="text-5xl font-bold num"><bdi dir="ltr">68</bdi></span>
        <span className="text-[#545a68] num"><bdi dir="ltr">/ 100</bdi></span>
        <span className="rounded-[2px] bg-[#fff4d6] text-[#9a6700] px-2 py-0.5 text-[12px] font-semibold">{ar ? 'يحتاج إلى عمل' : 'Needs work'}</span>
      </div>
      <div className="flex items-center gap-2 mt-2 text-[13px] text-[#545a68]">
        <span className="h-1.5 w-20 rounded-[2px] bg-[#f0f2f5] overflow-hidden"><span className="block h-full w-[78%] bg-[#14161c]/70" /></span>
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
            <div className="lp-face absolute inset-0 shadow-[0_30px_80px_-40px_rgba(16,24,40,0.45)] rounded-[2px]"><ReportFace lang="ar" /></div>
            <div className="lp-face lp-face-back absolute inset-0 shadow-[0_30px_80px_-40px_rgba(16,24,40,0.45)] rounded-[2px]"><ReportFace lang="en" /></div>
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

        <div className="relative overflow-hidden rounded-[2px] sm:rounded-[2px] bg-[rgb(var(--ember))] text-[#07061a] p-8 sm:p-14 lg:p-20" data-reveal>
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
