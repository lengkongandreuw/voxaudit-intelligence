import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, Circle, Loader2, XCircle, RefreshCw, Globe, Share2, MapPin, Swords, Sparkles, ShieldCheck,
} from 'lucide-react';
import { useProto, type DashState } from '../lib/prototype';
import { useScope } from '../lib/workspace';
import {
  AI_SUMMARY, AUDITS, COMPETITORS, FINDINGS, KPIS, MODULES, OVERALL, STAGES, type Kpi, type ModuleSummary,
} from '../lib/sample';
import {
  AiMarker, BandBadge, CoverageMeter, EvidenceBadge, InfoTip, Ltr, ScoreBlock, SectionHeader, SeverityBadge,
  StateCard, Unavailable, useL,
} from '../components/ui';
import { Mascot } from '../components/Mascot';

/* ---------- Blok yang dipakai ulang ---------- */

function KpiCard({ kpi }: { kpi: Kpi }) {
  const { t } = useProto();
  const L = useL();
  return (
    <div className="card p-4 flex flex-col gap-3 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <p className="text-muted font-medium">{L(kpi.label)}</p>
        <InfoTip label={`${L(kpi.label)}: ${t('dash.kpi.definition')}`}>
          <dl className="space-y-2">
            <div><dt className="font-semibold">{t('dash.kpi.definition')}</dt><dd className="text-muted">{L(kpi.definition)}</dd></div>
            <div><dt className="font-semibold">{t('dash.kpi.period')}</dt><dd className="text-muted">{L(kpi.period)}</dd></div>
            <div><dt className="font-semibold">{t('dash.kpi.source')}</dt><dd className="text-muted">{L(kpi.source)}</dd></div>
          </dl>
        </InfoTip>
      </div>
      {kpi.value === null ? (
        <Unavailable reason={kpi.reason ? L(kpi.reason) : t('ev.unavailable')} />
      ) : (
        <p className="flex items-baseline gap-1.5 flex-wrap">
          <span className={`font-display font-bold text-3xl ${kpi.evidence === 'estimated' ? 'text-muted' : ''}`}>
            {kpi.evidence === 'estimated' && <span aria-hidden="true">~</span>}<Ltr>{kpi.value}</Ltr>
          </span>
          {kpi.unit && <span className="text-muted">{L(kpi.unit)}</span>}
        </p>
      )}
      <div className="mt-auto"><EvidenceBadge type={kpi.evidence} /></div>
    </div>
  );
}

const MODULE_PATH: Record<ModuleSummary['id'], string> = {
  voxseo: 'intelligence/seo', voxsocial: 'intelligence/social', voxai: 'intelligence/ai', journey: 'intelligence/journey',
};

function ModuleCard({ m }: { m: ModuleSummary }) {
  const L = useL();
  const { base } = useScope();
  return (
    <Link to={`${base}/${MODULE_PATH[m.id]}`} className="card p-4 flex flex-col gap-3 hover:border-primary/50 transition-colors min-w-0">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{L(m.name)}</h3>
        <ArrowRight className="w-4 h-4 text-muted rtl:rotate-180" aria-hidden="true" />
      </div>
      <ScoreBlock score={m.score} coverage={m.coverage} />
      <p className="text-muted text-sm">{L(m.note)}</p>
    </Link>
  );
}

function CompetitorChart() {
  const { t } = useProto();
  const L = useL();
  const max = Math.max(...COMPETITORS.map((c) => c.value));
  if (COMPETITORS.length < 2) {
    return <StateCard state="insufficient" title={t('dash.notEnough')} body={t('dash.notEnough.body')} />;
  }
  return (
    <figure className="card p-4">
      <ul className="space-y-3.5">
        {COMPETITORS.map((c) => (
          <li key={c.name.en}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className={`truncate ${c.isClient ? 'font-semibold' : 'text-muted'}`}>{L(c.name)}</span>
              <span className="flex items-center gap-1.5 shrink-0">
                {c.evidence === 'estimated' && <EvidenceBadge type="estimated" short />}
                <span className="num font-semibold"><Ltr>{c.evidence === 'estimated' ? '~' : ''}{c.value}%</Ltr></span>
              </span>
            </div>
            <div className="h-3 rounded bg-surface-2 overflow-hidden">
              {/* Klien = brand blue, pesaing = netral, estimasi = arsir */}
              <div
                className={`h-full rounded ${c.isClient ? 'bg-primary' : c.evidence === 'estimated' ? 'text-muted/70 hatch border border-muted/50' : 'bg-muted/45'}`}
                style={{ width: `${(c.value / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <figcaption className="mt-4 pt-3 border-t border-line flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-muted">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary" aria-hidden="true" />{t('top.client')}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-muted/45" aria-hidden="true" />{t('ev.measured')}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm text-muted/70 hatch border border-muted/50" aria-hidden="true" />{t('ev.estimated')}</span>
      </figcaption>
    </figure>
  );
}

/* ---------- Tiga keadaan dashboard ---------- */

function EmptyDashboard() {
  const { t } = useProto();
  const L = useL();
  const { base } = useScope();
  const collects = [
    { icon: Globe, text: { en: 'Public website pages, speed and search visibility', ar: 'صفحات الموقع العامة وسرعته وظهوره في البحث' } },
    { icon: Share2, text: { en: 'Public Instagram and Facebook profile data', ar: 'البيانات العامة لحسابي إنستغرام وفيسبوك' } },
    { icon: MapPin, text: { en: 'Google Business Profile for each location', ar: 'ملف Google التجاري لكل فرع' } },
    { icon: Swords, text: { en: 'Public data for up to 3 competitors you choose', ar: 'بيانات عامة لما يصل إلى ٣ منافسين تختارهم' } },
    { icon: Sparkles, text: { en: 'How ready your site is to be cited by AI assistants', ar: 'مدى جاهزية موقعك ليستشهد به المساعدون الذكيون' } },
  ];
  return (
    <div className="space-y-6">
      <section className="card overflow-hidden grid md:grid-cols-[1fr_280px]">
        <div className="p-6 md:p-8 space-y-5">
          <div>
            <h2 className="font-display font-bold text-2xl">{t('dash.empty.title')}</h2>
            <p className="text-muted mt-2 max-w-xl">{t('dash.empty.body')}</p>
          </div>
          <ol className="flex flex-col sm:flex-row gap-3">
            {[t('dash.empty.step1'), t('dash.empty.step2'), t('dash.empty.step3')].map((s, i) => (
              <li key={s} className="flex items-center gap-2.5 sm:flex-1 rounded-lg border border-line px-3 py-2.5">
                <span className="w-6 h-6 rounded-full bg-primary-soft text-primary-strong font-semibold text-[13px] flex items-center justify-center num shrink-0"><Ltr>{i + 1}</Ltr></span>
                <span className="font-medium">{s}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-3">
            <Link to={`${base}/audits/new`} className="btn-brand h-11">{t('dash.empty.cta')}<ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" /></Link>
            <Link to={`${base}/profile`} className="btn-secondary h-11">{t('dash.empty.profile')}</Link>
          </div>
        </div>
        {/* Maskot diizinkan di empty state; tidak pernah di laporan */}
        <div className="hidden md:block bg-shell relative">
          <Mascot className="absolute inset-0" label="Ryan Vox, the VoxAudit robot mascot" />
        </div>
      </section>

      <section aria-labelledby="collect">
        <SectionHeader title={L({ en: 'What a first audit collects', ar: 'ما يجمعه التدقيق الأول' })} sub={L({ en: 'Shown before launch, so nothing is collected by surprise.', ar: 'يُعرض قبل التشغيل حتى لا يُجمع أي شيء دون علمك.' })} />
        <ul id="collect" className="card divide-y divide-line">
          {collects.map(({ icon: Icon, text }) => (
            <li key={text.en} className="flex items-center gap-3 px-4 py-3">
              <Icon className="w-4 h-4 text-muted shrink-0" aria-hidden="true" />
              <span>{L(text)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeader title={t('dash.modules')} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODULES.map((m) => <StateCard key={m.id} state="empty" title={L(m.name)} body={L({ en: 'No audit has run yet.', ar: 'لم يُجرَ أي تدقيق بعد.' })} />)}
        </div>
      </section>
    </div>
  );
}

function StageIcon({ status }: { status: (typeof STAGES)[number]['status'] }) {
  if (status === 'complete') return <CheckCircle2 className="w-5 h-5 text-good" aria-hidden="true" />;
  if (status === 'running') return <Loader2 className="w-5 h-5 text-primary animate-spin" aria-hidden="true" />;
  if (status === 'failed') return <XCircle className="w-5 h-5 text-critical" aria-hidden="true" />;
  return <Circle className="w-5 h-5 text-muted" aria-hidden="true" />;
}

function PartialDashboard() {
  const { t } = useProto();
  const L = useL();
  const { base } = useScope();
  const done = STAGES.filter((s) => s.status === 'complete').length;
  const statusLabel = { complete: t('status.complete'), running: t('status.running'), failed: t('status.failed'), queued: t('status.queued') };
  return (
    <div className="space-y-6">
      <section className="card p-5 md:p-6" aria-labelledby="progress-title">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 id="progress-title" className="font-semibold text-base">{t('dash.partial.title')}</h2>
            {/* Status per tahap, bukan persentase palsu */}
            <p className="text-muted mt-0.5">{t('dash.partial.sub')} <span className="num font-medium text-ink"><Ltr>{done}/{STAGES.length}</Ltr></span></p>
          </div>
          <Link to={`${base}/audits/progress`} className="btn-secondary">{t('dash.partial.open')}</Link>
        </div>
        <ol className="divide-y divide-line border border-line rounded-lg">
          {STAGES.map((s) => (
            <li key={s.id} className="flex items-center gap-3 px-4 py-3">
              <StageIcon status={s.status} />
              <div className="flex-1 min-w-0">
                <p className="font-medium">{L(s.label)}</p>
                <p className={`text-sm ${s.status === 'failed' ? 'text-critical' : 'text-muted'}`}>{L(s.detail)}</p>
              </div>
              <span className="text-sm text-muted hidden sm:inline">{statusLabel[s.status]}</span>
              {s.status === 'failed' && (
                <button type="button" className="btn-secondary h-8"><RefreshCw className="w-4 h-4" aria-hidden="true" />{t('cs.retry')}</button>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <SectionHeader title={t('dash.modules')} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ModuleCard m={MODULES[0]} />
          <StateCard state="loading" />
          <StateCard state="partial" title={L(MODULES[1].name)} body={L({ en: 'Instagram collected. Facebook still running — score appears when both finish.', ar: 'جُمعت بيانات إنستغرام. فيسبوك ما زال قيد التشغيل — تظهر النتيجة عند اكتمالهما.' })} />
          <StateCard state="unavailable" title={L({ en: 'Google Business Profile', ar: 'ملف Google التجاري' })} body={L({ en: 'Fetch failed. Local metrics will be marked unavailable unless the retry succeeds.', ar: 'فشل الجلب. ستُعلَّم المؤشرات المحلية كغير متاحة ما لم تنجح إعادة المحاولة.' })} />
        </div>
      </section>
    </div>
  );
}

function PopulatedDashboard() {
  const { t } = useProto();
  const L = useL();
  const { base } = useScope();
  const statusLabel = { toReview: t('status.toReview'), accepted: t('status.accepted') };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-12 gap-4">
        <section className="card p-5 lg:col-span-5 space-y-4" aria-labelledby="overall">
          <div className="flex items-start justify-between gap-2">
            <h2 id="overall" className="font-semibold text-base">{t('dash.overall')}</h2>
            <InfoTip label={t('dash.coverage')}>
              <p className="font-semibold mb-1">{t('dash.coverage')}</p>
              <p className="text-muted">{t('dash.coverage.help')}</p>
              <p className="text-muted mt-2">{L({ en: 'Methodology', ar: 'المنهجية' })} <Ltr>{OVERALL.methodology}</Ltr> · <Ltr>0–49</Ltr> {t('band.critical')}, <Ltr>50–69</Ltr> {t('band.needsWork')}, <Ltr>70–84</Ltr> {t('band.solid')}, <Ltr>85–100</Ltr> {t('band.strong')}</p>
            </InfoTip>
          </div>
          <ScoreBlock score={OVERALL.score} coverage={OVERALL.coverage} size="lg" />
          <AiMarker><p className="leading-relaxed">{L(AI_SUMMARY)}</p></AiMarker>
        </section>

        <section className="lg:col-span-7" aria-labelledby="modules">
          <h2 id="modules" className="sr-only">{t('dash.modules')}</h2>
          <div className="grid sm:grid-cols-2 gap-4 h-full">
            {MODULES.map((m) => <ModuleCard key={m.id} m={m} />)}
          </div>
        </section>
      </div>

      <section aria-labelledby="kpis">
        <h2 id="kpis" className="sr-only">KPIs</h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {KPIS.map((k) => <KpiCard key={k.id} kpi={k} />)}
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-4">
        <section className="lg:col-span-7 min-w-0">
          <SectionHeader title={t('dash.findings')} sub={t('dash.findings.sub')}
            action={<Link to={`${base}/reports/latest`} className="text-sm font-medium text-primary-strong hover:underline whitespace-nowrap">{t('dash.viewAll')}</Link>} />
          <ul className="card divide-y divide-line">
            {FINDINGS.map((f) => (
              <li key={f.id} className="p-4 flex gap-3 items-start">
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="font-medium leading-snug">{L(f.title)}</p>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                    <SeverityBadge level={f.severity} />
                    <span>{L(f.module)}</span>
                    <EvidenceBadge type={f.evidence} short />
                    {f.url && <code className="text-[13px] bg-surface-2 rounded px-1.5"><Ltr>{f.url}</Ltr></code>}
                  </div>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold
                  ${f.status === 'accepted' ? 'bg-good-soft text-good' : 'bg-surface-2 text-muted border border-line'}`}>
                  {f.status === 'accepted' && <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />}
                  {statusLabel[f.status]}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className="lg:col-span-5 min-w-0">
          <SectionHeader title={t('dash.competitors')} sub={t('dash.competitors.sub')} />
          <CompetitorChart />
        </section>
      </div>

      <section>
        <SectionHeader title={t('dash.audits')} />
        <div className="card overflow-x-auto">
          <table className="w-full text-start min-w-[640px]">
            <thead className="text-muted text-[13px] border-b border-line">
              <tr>
                {[t('col.date'), t('col.type'), t('col.coverage'), t('col.score'), t('col.status'), L({ en: 'Method', ar: 'المنهجية' })].map((h) => (
                  <th key={h} scope="col" className="text-start font-medium px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {AUDITS.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 whitespace-nowrap">{L(a.date)}</td>
                  <td className="px-4 py-3">{L(a.type)}</td>
                  <td className="px-4 py-3"><CoverageMeter value={a.coverage} /></td>
                  <td className="px-4 py-3">{a.score === null ? '—' : <span className="flex items-center gap-2"><span className="num font-semibold"><Ltr>{a.score}</Ltr></span><BandBadge score={a.score} /></span>}</td>
                  <td className="px-4 py-3">{a.status === 'partial' ? <span className="text-watch font-medium">{t('status.partial')}</span> : t('status.complete')}</td>
                  {/* Re-audit hanya dibandingkan bila versi metodologi sama */}
                  <td className="px-4 py-3"><code className="text-[13px] bg-surface-2 rounded px-1.5"><Ltr>{a.method}</Ltr></code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function Dashboard() {
  const { t, dashState } = useProto();
  const L = useL();
  const { client } = useScope();
  // Cedar mengikuti kontrol prototype; klien contoh lain punya keadaan tetap.
  const state: DashState = client.id === 'cedar' ? dashState : client.defaultState;

  return (
    <div className="max-w-content mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display font-bold text-2xl md:text-[28px]">{t('dash.title')}</h1>
          <p className="text-muted mt-1">{t('dash.sub', { client: L(client.name) })} · {L(client.locations)}</p>
        </div>
        {state === 'populated' && (
          <p className="text-sm text-muted">{t('dash.lastAudit')}: <span className="text-ink font-medium">{L(AUDITS[0].date)}</span> · EN + AR</p>
        )}
      </header>
      {state === 'empty' && <EmptyDashboard />}
      {state === 'partial' && <PartialDashboard />}
      {state === 'populated' && <PopulatedDashboard />}
    </div>
  );
}
