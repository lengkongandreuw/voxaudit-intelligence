import { createElement, useEffect, useState } from 'react';

// Maskot 3D Ryan Vox. Aturan Phase 1: hanya di onboarding, layar kosong, dan
// situs marketing/login — tidak pernah di dalam laporan atau PDF klien.
// model-viewer (≈1 MB) dimuat malas agar tidak membebani layar lain.

const MODEL_URL = `${import.meta.env.BASE_URL}brand/ryan-vox.glb`;

export function Mascot({ className = '', label }: { className?: string; label: string }) {
  const [ready, setReady] = useState(false);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    let alive = true;
    import('@google/model-viewer').then(() => alive && setReady(true)).catch(() => { /* tanpa 3D, area tetap kosong */ });
    return () => { alive = false; };
  }, []);

  return (
    <div className={className}>
      {ready && createElement('model-viewer', {
        src: MODEL_URL,
        alt: label,
        'camera-controls': true,
        'disable-zoom': true,
        'disable-pan': true,
        'interaction-prompt': 'none',
        'auto-rotate': reduceMotion ? undefined : true,
        'auto-rotate-delay': 0,
        'rotation-per-second': '18deg',
        'camera-orbit': '20deg 80deg auto',
        'shadow-intensity': '0.6',
        exposure: '1.05',
        loading: 'lazy',
        style: { width: '100%', height: '100%', background: 'transparent', '--poster-color': 'transparent' },
      })}
    </div>
  );
}
