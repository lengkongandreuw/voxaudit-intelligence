import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Layers, ShieldAlert } from 'lucide-react';
import { useProto } from '../lib/prototype';
import { ALL_ITEMS, SCREEN_INFO } from '../lib/nav';
import { homePath, useScope } from '../lib/workspace';
import { Logo, SampleBanner, StateCard } from '../components/ui';

/** Layar yang belum dirancang di Sprint 1: menampilkan nomor layar, sprint, dan aturan integritasnya. */
export function Planned() {
  const { t, role } = useProto();
  const { base } = useScope();
  const { pathname } = useLocation();
  const item = ALL_ITEMS.find((i) => pathname.endsWith(`/${i.path}`));
  const info = item?.screen ? SCREEN_INFO[item.screen] : undefined;

  // Perlindungan berbasis peran di tingkat rute, bukan hanya menyembunyikan link
  if (item && !item.roles.includes(role)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <StateCard state="denied" body={`${t(item.label)} — ${t(`role.${role}` as const)}`}
          action={<Link to={`${base}/dashboard`} className="btn-secondary">{t('planned.back')}</Link>} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-10">
      <div className="card p-6 md:p-8 space-y-5">
        <p className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted uppercase tracking-wider">
          <Layers className="w-4 h-4" aria-hidden="true" />{t('planned.title')}{item?.screen !== undefined && <> · #{item.screen}</>}
        </p>
        <h1 className="font-display font-bold text-2xl">{item ? t(item.label) : pathname}</h1>
        {info && (
          <>
            <p className="inline-flex rounded-full bg-primary-soft text-primary-strong px-2.5 py-1 text-sm font-semibold">
              {t('planned.sprint', { n: info.sprint })}
            </p>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-line p-4">
                <dt className="flex items-center gap-2 font-semibold"><ShieldCheck className="w-4 h-4 text-good" aria-hidden="true" />{t('planned.rule')}</dt>
                <dd className="text-muted mt-1">{info.rule}</dd>
              </div>
              <div className="rounded-lg border border-line p-4">
                <dt className="font-semibold">{t('planned.states')}</dt>
                <dd className="text-muted mt-1">{info.states}</dd>
              </div>
            </dl>
          </>
        )}
        <Link to={`${base}/dashboard`} className="btn-secondary"><ArrowLeft className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />{t('planned.back')}</Link>
      </div>
    </div>
  );
}

/** Permukaan terpisah: tidak berbagi sidebar dengan aplikasi agensi. */
export function SeparateSurface({ kind }: { kind: 'portal' | 'admin' }) {
  const { t, role, set } = useProto();
  const navigate = useNavigate();
  const allowed = kind === 'portal' ? role === 'client' : role === 'platform';
  return (
    <div className="min-h-screen flex flex-col">
      <SampleBanner />
      <header className="h-14 bg-shell border-b border-shell-border px-4 md:px-6 flex items-center justify-between">
        <Logo />
        <span className="flex items-center gap-3">
          <span className="hidden sm:inline text-shell-muted text-sm">{kind === 'portal' ? t('portal.title') : t('nav.adminConsole')}</span>
          {/* Hanya di prototype: jalan pulang ke tampilan agensi */}
          <button type="button" className="btn h-9 border border-shell-border text-shell-text hover:bg-white/[0.06]"
            onClick={() => { set('role', 'owner'); navigate(homePath('owner')); }}>
            {t('role.owner')}
          </button>
        </span>
      </header>
      {kind === 'admin' && (
        <div role="status" className="bg-watch-soft text-watch border-b border-watch/30 px-4 md:px-6 py-2 text-sm font-medium flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />{t('top.loggedAccess')}
        </div>
      )}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-10 space-y-4">
        {!allowed ? (
          <StateCard state="denied" body={t(`role.${role}` as const)} />
        ) : (
          <div className="card p-6 md:p-8 space-y-3">
            <h1 className="font-display font-bold text-2xl">{kind === 'portal' ? t('portal.title') : t('nav.adminConsole')}</h1>
            <p className="text-muted">{kind === 'portal' ? t('portal.sub') : SCREEN_INFO[22].rule}</p>
            <p className="inline-flex rounded-full bg-primary-soft text-primary-strong px-2.5 py-1 text-sm font-semibold">{kind === 'portal' ? t('portal.sprint') : t('planned.sprint', { n: 4 })}</p>
          </div>
        )}
      </main>
    </div>
  );
}
