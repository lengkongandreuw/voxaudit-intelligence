import { useEffect, useState, type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { useProto } from '../lib/prototype';
import {
  AiMarker, BandBadge, CoverageMeter, EvidenceBadge, Ltr, ScoreBlock, SeverityBadge, StateCard, type CommonState,
} from '../components/ui';

// Referensi untuk programmer: token, komponen, dan state. Semua contoh di
// halaman ini memakai komponen yang sama dengan layar produk.

type Swatch = { token: string; role: string; never?: string; onDark?: boolean };

const SWATCHES: Swatch[] = [
  { token: 'primary', role: 'Brand blue #0094ea — fills, focus rings, client series in charts', never: 'Scores or status' },
  { token: 'primary-strong', role: 'Link text and primary button background (AA-safe variant of brand blue)' },
  { token: 'ai', role: 'AI interpretation marker (AA-safe variant of brand magenta #cf41b2)', never: 'Decoration' },
  { token: 'highlight', role: 'Brand cyan #00e5ff — dark-shell accents, active sidebar item', never: 'Text on white (fails contrast)', onDark: true },
  { token: 'good', role: 'Status: good / Solid & Strong bands' },
  { token: 'watch', role: 'Status: watch / Needs work band' },
  { token: 'critical', role: 'Status: critical / Critical band and severity' },
  { token: 'ink', role: 'Body text' },
  { token: 'muted', role: 'Secondary text, unavailable values, competitor series' },
  { token: 'line', role: '1 px borders' },
  { token: 'canvas', role: 'Analysis canvas background' },
  { token: 'shell-bg', role: 'Brand shell: sidebar, top bar, login', onDark: true },
];

function rgbOf(token: string, el: Element = document.documentElement) {
  const raw = getComputedStyle(el).getPropertyValue(`--${token}`).trim();
  return raw.split(/\s+/).map(Number) as [number, number, number];
}
function luminance([r, g, b]: number[]) {
  const c = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(a: number[], b: number[]) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}
const hex = (rgb: number[]) => `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;

function SwatchRow({ s }: { s: Swatch }) {
  const { theme } = useProto();
  const [info, setInfo] = useState<{ hex: string; ratio: number } | null>(null);
  useEffect(() => {
    const c = rgbOf(s.token);
    const bg = s.onDark ? rgbOf('shell-bg') : rgbOf('surface');
    const against = s.token === 'shell-bg' ? rgbOf('shell-text') : s.token === 'canvas' || s.token === 'line' ? rgbOf('ink') : bg;
    setInfo({ hex: hex(c), ratio: contrast(c, against) });
  }, [s, theme]);
  const pass = info && info.ratio >= 4.5;
  return (
    <li className="flex items-center gap-3 py-3">
      <span className="w-10 h-10 rounded-lg border border-line shrink-0" style={{ background: `rgb(var(--${s.token}))` }} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold"><code><Ltr>--{s.token}</Ltr></code> <span className="text-muted font-normal num"><Ltr>{info?.hex}</Ltr></span></p>
        <p className="text-muted text-sm">{s.role}{s.never && <> · <span className="text-critical">Never: {s.never}</span></>}</p>
      </div>
      {info && (
        <span className={`text-[12px] font-semibold rounded px-1.5 py-0.5 num ${pass ? 'bg-good-soft text-good' : 'bg-surface-2 text-muted'}`}>
          <Ltr>{info.ratio.toFixed(1)}:1</Ltr>
        </span>
      )}
    </li>
  );
}

function Block({ id, title, children, note }: { id: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="card p-5 md:p-6 space-y-4 scroll-mt-24">
      <div>
        <h2 id={`${id}-h`} className="font-semibold text-base">{title}</h2>
        {note && <p className="text-muted mt-0.5">{note}</p>}
      </div>
      {children}
    </section>
  );
}

const STATES: { s: CommonState; body: string }[] = [
  { s: 'empty', body: 'First run or no records. Explain the next step.' },
  { s: 'loading', body: '' },
  { s: 'partial', body: 'Some sources returned; the rest are still running or failed.' },
  { s: 'unavailable', body: 'The source could not be reached. Show the reason; never draw zero.' },
  { s: 'insufficient', body: 'Data exists but is not enough to score. Score is withheld.' },
  { s: 'na', body: 'The metric does not apply to this business (e.g. no mobile app).' },
  { s: 'error', body: 'Request failed. Offer a retry and keep what already loaded.' },
  { s: 'denied', body: 'The role cannot see this. Enforced by route, not CSS.' },
];

export function DesignSystem() {
  const sections = [
    ['colors', 'Color roles'], ['type', 'Type & layout'], ['buttons', 'Buttons & inputs'],
    ['evidence', 'Evidence language'], ['scores', 'Scores & severity'], ['states', 'Cross-cutting states'], ['viz', 'Data visualization rules'],
  ];
  return (
    <div className="max-w-content mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      <header>
        <h1 className="font-display font-bold text-2xl md:text-[28px]">Design system</h1>
        <p className="text-muted mt-1 max-w-2xl">Tokens, components and states for VoxAudit Intelligence, Sprint 1. Every example here is the production component, so what you see is what ships. Contrast ratios are computed live for the current theme.</p>
        <nav aria-label="Design system sections" className="flex flex-wrap gap-2 mt-4">
          {sections.map(([id, label]) => <a key={id} href={`#${id}`} className="rounded-full border border-line bg-surface px-3 py-1 text-sm hover:border-primary">{label}</a>)}
        </nav>
      </header>

      <Block id="colors" title="Color roles" note="Brand hex values from the brand kit. Where a brand color fails 4.5:1 as text, an AA-safe ‘strong’ variant is used for text and the brand value is kept for fills.">
        <ul className="divide-y divide-line">{SWATCHES.map((s) => <SwatchRow key={s.token} s={s} />)}</ul>
      </Block>

      <Block id="type" title="Type & layout">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="font-display font-bold text-3xl">Montserrat — display, sparingly</p>
            <p className="text-base">Inter — UI and body. Minimum 14 px in the app, 16 px in reports and PDFs.</p>
            <p className="font-arabic text-base" dir="rtl" lang="ar">IBM Plex Sans Arabic — واجهة المستخدم والتقارير، بوزن يوازي Inter.</p>
            <p className="num text-2xl font-semibold"><Ltr>1,234.56 · 98% · 4.1 s</Ltr> <span className="text-muted text-sm font-normal">tabular numerals</span></p>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['Spacing grid', '8 px'], ['Columns', '12'], ['Desktop target', '1440 px'], ['Sidebar', '248 px → 72 px'],
              ['Tablet', '1024 px (sidebar collapsed)'], ['Mobile', '390 px, bottom navigation'], ['Card radius', '12 px'], ['RTL', 'Logical CSS properties'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-line p-3"><dt className="text-muted">{k}</dt><dd className="font-semibold mt-0.5">{v}</dd></div>
            ))}
          </dl>
        </div>
      </Block>

      <Block id="buttons" title="Buttons & inputs" note="The brand gradient appears only on “Create new audit”, the logo and the marketing hero.">
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-brand"><Plus className="w-4 h-4" aria-hidden="true" />Create new audit</button>
          <button type="button" className="btn-primary">Primary</button>
          <button type="button" className="btn-secondary">Secondary</button>
          <button type="button" className="btn-ghost">Ghost</button>
          <button type="button" className="btn-primary" disabled>Disabled</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          <div><label htmlFor="ds-in" className="label">Website URL</label><input id="ds-in" className="input" placeholder="https://cedarco.example" /></div>
          <div>
            <label htmlFor="ds-err" className="label">Work email</label>
            <input id="ds-err" className="input border-critical" aria-invalid="true" aria-describedby="ds-err-m" defaultValue="layla@" />
            <p id="ds-err-m" className="mt-1.5 text-sm text-critical">Enter a valid email address, like name@company.com.</p>
          </div>
        </div>
      </Block>

      <Block id="evidence" title="Evidence language" note="Used on every chart, card and table. Unavailable is never drawn as zero.">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {([
            ['measured', 'Solid fill, source and date on hover'],
            ['connected', 'Solid fill + plug icon — client’s own analytics, CRM or ads'],
            ['estimated', 'Hatched or outlined fill, “Est.” tag'],
            ['ai', 'Magenta marker on AI-written text'],
            ['unavailable', 'Gray dash with a reason'],
            ['na', 'Gray dash; explains why it does not apply'],
          ] as const).map(([k, d]) => (
            <li key={k} className="rounded-lg border border-line p-3 space-y-2"><EvidenceBadge type={k} /><p className="text-muted text-sm">{d}</p></li>
          ))}
        </ul>
        <AiMarker><p>Patients are looking for the clinic but hit dead ends at booking. This paragraph was written by AI from the findings above it.</p></AiMarker>
      </Block>

      <Block id="scores" title="Scores & severity" note="0–100 with a named band and a coverage meter beside every score. Band thresholds are a prototype proposal pending the scoring methodology.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[38, 61, 74, 91].map((s, i) => <div key={s} className="rounded-lg border border-line p-4"><ScoreBlock score={s} coverage={[45, 62, 80, 94][i]} /></div>)}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <BandBadge score={30} /><BandBadge score={60} /><BandBadge score={75} /><BandBadge score={90} />
          <span className="w-px h-5 bg-line" aria-hidden="true" />
          <SeverityBadge level="critical" /><SeverityBadge level="high" /><SeverityBadge level="medium" /><SeverityBadge level="low" />
          <span className="w-px h-5 bg-line" aria-hidden="true" />
          <CoverageMeter value={42} /><CoverageMeter value={66} /><CoverageMeter value={88} />
        </div>
        <div className="rounded-lg border border-line p-4 max-w-xs"><ScoreBlock score={null} coverage={28} /><p className="text-muted text-sm mt-2">Insufficient evidence: score withheld, coverage still shown.</p></div>
      </Block>

      <Block id="states" title="Cross-cutting states" note="Designed once, reused everywhere.">
        <div className="grid sm:grid-cols-2 gap-4">
          {STATES.map(({ s, body }) => <StateCard key={s} state={s} body={body || undefined} />)}
        </div>
      </Block>

      <Block id="viz" title="Data visualization rules">
        <ul className="list-disc ps-5 space-y-1.5">
          <li>One gauge only, on the report overview. Elsewhere: bars for comparisons, lines for history, tables for evidence.</li>
          <li>The client is always brand blue; competitors are neutral; estimated values are hatched with an “Est.” tag.</li>
          <li>No chart is drawn with fewer than two comparable data points — an explanation card appears instead.</li>
          <li>No gradients or glow inside charts.</li>
          <li>Numbers, URLs and code stay left-to-right inside Arabic text.</li>
        </ul>
      </Block>
    </div>
  );
}
