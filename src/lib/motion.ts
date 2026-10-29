import { useEffect, useState, type RefObject } from 'react';

// Animasi ringan tanpa library: semua efek hanya mengubah transform/opacity
// lewat CSS variable, dan satu loop rAF per hook. Semua mati bila pengguna
// memilih "reduce motion".

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Menandai setiap [data-reveal] di dalam root dengan data-in saat masuk viewport. */
export function useReveal(root: RefObject<HTMLElement>, key: unknown = null) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>('[data-reveal]');
    if (reducedMotion() || !('IntersectionObserver' in window)) {
      targets.forEach((t) => t.setAttribute('data-in', ''));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.setAttribute('data-in', ''); io.unobserve(e.target); }
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [root, key]);
}

/**
 * Menulis --p (0..1) = seberapa jauh elemen sudah dilewati scroll.
 * Mengembalikan langkah aktif bila `steps` diberikan (re-render hanya saat langkah berubah).
 */
export function useScrollProgress(ref: RefObject<HTMLElement>, steps = 0) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let last = -1;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : (r.top < window.innerHeight ? 1 : 0);
      el.style.setProperty('--p', p.toFixed(4));
      if (steps) {
        const s = Math.min(steps - 1, Math.floor(p * steps));
        if (s !== last) { last = s; setStep(s); }
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [ref, steps]);
  return step;
}

/** Kemiringan & sorotan mengikuti pointer: menulis --rx, --ry, --mx, --my. */
export function usePointerTilt(ref: RefObject<HTMLElement>, strength = 8) {
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !window.matchMedia('(hover: hover)').matches) return;
    let raf = 0;
    let ev: PointerEvent | null = null;
    const apply = () => {
      raf = 0;
      if (!ev) return;
      const r = el.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width;
      const y = (ev.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      el.style.setProperty('--ry', `${((x - 0.5) * strength).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${((0.5 - y) * strength).toFixed(2)}deg`);
    };
    const move = (e: PointerEvent) => { ev = e; if (!raf) raf = requestAnimationFrame(apply); };
    const leave = () => { ev = null; el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [ref, strength]);
}

/** Tombol "magnetik": bergeser sedikit ke arah pointer. */
export function useMagnetic(ref: RefObject<HTMLElement>, pull = 0.25) {
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !window.matchMedia('(hover: hover)').matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * pull;
      const y = (e.clientY - (r.top + r.height / 2)) * pull;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    };
    const leave = () => { el.style.transform = ''; };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [ref, pull]);
}

/** Hitung naik untuk angka kecil, dimulai saat terlihat. */
export function useCountUp(ref: RefObject<HTMLElement>, to: number, ms = 900) {
  const [v, setV] = useState(reducedMotion() ? to : 0);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) { setV(to); return; }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / ms);
        setV(Math.round(to * (1 - (1 - k) ** 3)));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [ref, to, ms]);
  return v;
}
