import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Building2, CheckCircle2, Clock, KeyRound, Mail } from 'lucide-react';
import { useProto, type Role } from '../lib/prototype';
import { homePath } from '../lib/workspace';
import { Logo, SampleBanner } from '../components/ui';
import { Mascot } from '../components/Mascot';

export type AuthMode = 'signin' | 'signup' | 'reset' | 'sso' | 'invite';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
    </svg>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {error && <p id={`${id}-err`} className="mt-1.5 text-sm text-critical flex gap-1.5"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />{error}</p>}
    </div>
  );
}

function LangToggle() {
  const { lang, set } = useProto();
  return (
    <button type="button" onClick={() => set('lang', lang === 'en' ? 'ar' : 'en')}
      className="text-sm text-shell-muted hover:text-white rounded-lg px-3 h-9 border border-shell-border">
      {lang === 'en' ? 'العربية' : 'English'}
    </button>
  );
}

export function AuthPage({ mode }: { mode: AuthMode }) {
  const p = useProto();
  const { t } = p;
  const navigate = useNavigate();
  const { token } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<'agency' | 'consultant' | 'business'>('agency');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [sent, setSent] = useState(false);

  const enter = (role: Role) => {
    p.set('role', role);
    p.set('signedIn', true);
    navigate(homePath(role));
  };

  const validate = (needPassword: boolean) => {
    const e: typeof errors = {};
    if (!EMAIL_RE.test(email.trim())) e.email = t('auth.error.email');
    if (needPassword && !password) e.password = t('auth.error.password');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSignIn = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate(true)) return;
    if (password === 'wrong') { setErrors({ form: t('auth.error.credentials') }); return; }
    enter(p.role === 'client' ? 'owner' : p.role);
  };

  const onSignUp = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate(true)) return;
    enter(accountType === 'agency' ? 'owner' : accountType);
  };

  const onReset = (ev: FormEvent) => {
    ev.preventDefault();
    if (validate(false)) setSent(true);
  };

  const onSso = (ev: FormEvent) => {
    ev.preventDefault();
    if (validate(false)) enter('owner');
  };

  const inviteExpired = mode === 'invite' && token === 'expired';
  const vars = { agency: 'Northwind Growth Studio', inviter: 'Layla Haddad', role: t('role.member') };

  const emailInput = (
    <Field id="email" label={t('auth.email')} error={errors.email}>
      <input id="email" type="email" autoComplete="email" className="input" value={email} placeholder="name@company.com"
        aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined}
        onChange={(e) => { setEmail(e.target.value); setErrors({}); }} />
    </Field>
  );

  const passwordInput = (autoComplete: string) => (
    <Field id="password" label={t('auth.password')} error={errors.password}>
      <input id="password" type="password" autoComplete={autoComplete} className="input" value={password}
        aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-err' : undefined}
        onChange={(e) => { setPassword(e.target.value); setErrors({}); }} />
    </Field>
  );

  const formError = errors.form && (
    <div role="alert" className="rounded-lg border border-critical/40 bg-critical-soft text-critical p-3 text-sm flex gap-2">
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />{errors.form}
    </div>
  );

  const providers = (
    <>
      <button type="button" className="btn-secondary w-full h-11" onClick={() => enter(p.role === 'client' ? 'owner' : p.role)}>
        <GoogleIcon />{t('auth.google')}
      </button>
      <Link to="/sso" className="btn-ghost w-full h-10 text-muted"><Building2 className="w-4 h-4" aria-hidden="true" />{t('auth.sso')}</Link>
      <div className="flex items-center gap-3 text-[13px] text-muted" aria-hidden="true">
        <span className="flex-1 h-px bg-line" />{t('auth.or')}<span className="flex-1 h-px bg-line" />
      </div>
    </>
  );

  let title = '', sub = '', body: ReactNode = null;

  if (mode === 'signin') {
    title = t('auth.signIn.title'); sub = t('auth.signIn.sub');
    body = (
      <>
        {providers}
        <form onSubmit={onSignIn} noValidate className="space-y-4">
          {formError}
          {emailInput}
          {passwordInput('current-password')}
          <div className="flex justify-end -mt-1"><Link to="/reset" className="text-sm text-primary-strong hover:underline">{t('auth.forgot')}</Link></div>
          <button type="submit" className="btn-primary w-full h-11">{t('auth.submit.signIn')}</button>
        </form>
        <p className="text-sm text-muted text-center">{t('auth.noAccount')} <Link to="/signup" className="text-primary-strong font-medium hover:underline">{t('auth.toSignUp')}</Link></p>
        <p className="text-[13px] text-muted text-center border border-dashed border-line rounded-lg p-2">{t('auth.hint')}</p>
      </>
    );
  } else if (mode === 'signup') {
    title = t('auth.signUp.title'); sub = t('auth.signUp.sub');
    body = (
      <>
        {providers}
        <form onSubmit={onSignUp} noValidate className="space-y-4">
          <fieldset>
            <legend className="label">{t('auth.accountType')}</legend>
            <div className="grid grid-cols-3 gap-2">
              {(['agency', 'consultant', 'business'] as const).map((k) => (
                <label key={k} className={`cursor-pointer rounded-lg border px-2 py-2.5 text-center text-sm font-medium ${accountType === k ? 'border-primary bg-primary-soft text-primary-strong' : 'border-line hover:bg-surface-2'}`}>
                  <input type="radio" name="type" value={k} checked={accountType === k} onChange={() => setAccountType(k)} className="sr-only" />
                  {t(`auth.type.${k}` as const)}
                </label>
              ))}
            </div>
          </fieldset>
          <Field id="name" label={t('auth.name')}>
            <input id="name" autoComplete="name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          {emailInput}
          {passwordInput('new-password')}
          <button type="submit" className="btn-primary w-full h-11">{t('auth.submit.signUp')}</button>
        </form>
        <p className="text-sm text-muted text-center">{t('auth.haveAccount')} <Link to="/signin" className="text-primary-strong font-medium hover:underline">{t('auth.toSignIn')}</Link></p>
      </>
    );
  } else if (mode === 'reset') {
    title = t('auth.reset.title'); sub = t('auth.reset.sub');
    body = sent ? (
      <div role="status" className="rounded-lg border border-good/40 bg-good-soft text-good p-3 text-sm flex gap-2">
        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
        <span>{t('auth.reset.sent', { email: email.trim() })}</span>
      </div>
    ) : (
      <form onSubmit={onReset} noValidate className="space-y-4">
        {emailInput}
        <button type="submit" className="btn-primary w-full h-11"><Mail className="w-4 h-4" aria-hidden="true" />{t('auth.reset.submit')}</button>
      </form>
    );
  } else if (mode === 'sso') {
    title = t('auth.sso.title'); sub = t('auth.sso.sub');
    body = (
      <form onSubmit={onSso} noValidate className="space-y-4">
        {emailInput}
        <button type="submit" className="btn-primary w-full h-11"><KeyRound className="w-4 h-4" aria-hidden="true" />{t('auth.sso.submit')}</button>
      </form>
    );
  } else if (inviteExpired) {
    title = t('auth.invite.expired.title'); sub = t('auth.invite.expired.sub', vars);
    body = (
      <div className="space-y-3">
        <div className="rounded-lg border border-watch/40 bg-watch-soft text-watch p-3 text-sm flex gap-2">
          <Clock className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" /><span>Invite sent 19 Oct 2026 · expired 26 Oct 2026</span>
        </div>
        <button type="button" className="btn-primary w-full h-11">{t('auth.invite.request')}</button>
      </div>
    );
  } else {
    title = t('auth.invite.title', vars); sub = t('auth.invite.sub', vars);
    body = (
      <form onSubmit={(e) => { e.preventDefault(); enter('member'); }} className="space-y-4">
        <Field id="email" label={t('auth.email')}>
          <input id="email" type="email" className="input bg-surface-2" value="sami@northwind.example" readOnly />
        </Field>
        {passwordInput('new-password')}
        <button type="submit" className="btn-primary w-full h-11">{t('auth.invite.accept')}</button>
      </form>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-shell text-shell-text">
      <SampleBanner />
      <div className="flex-1 relative overflow-hidden">
        {/* Grid halus + satu cahaya gradien — gradien hanya di area brand */}
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.35]"
          style={{ backgroundImage: 'linear-gradient(rgb(255 255 255 / 0.04) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div aria-hidden="true" className="absolute -top-40 -start-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-25"
          style={{ background: 'radial-gradient(circle, #00e5ff 0%, #7c3aed 60%, transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-12 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-40px)]">
          <div className="flex items-center justify-between lg:hidden"><Logo /><LangToggle /></div>

          <section className="hidden lg:block space-y-6" aria-labelledby="pitch">
            <div className="flex items-center justify-between"><Logo size="lg" /><LangToggle /></div>
            <p className="inline-flex rounded-full border border-shell-border bg-white/[0.04] px-3 py-1 text-[13px] font-semibold text-highlight">{t('auth.pitch.kicker')}</p>
            <div className="flex items-center gap-4">
              <p id="pitch" className="font-display font-extrabold text-6xl leading-[1.02] tracking-tight shrink-0">
                {t('auth.pitch.title1')}<br />{t('auth.pitch.title2')}<br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg,#00e5ff,#a78bfa)' }}>{t('auth.pitch.title3')}</span>
              </p>
              <Mascot className="h-64 flex-1 min-w-[160px]" label="Ryan Vox, the VoxAudit robot mascot" />
            </div>
            <p className="text-shell-muted text-lg max-w-md leading-relaxed">{t('auth.pitch.body')}</p>
            <ul className="space-y-2.5">
              {[t('auth.pitch.p1'), t('auth.pitch.p2'), t('auth.pitch.p3')].map((x) => (
                <li key={x} className="flex gap-2.5 text-shell-text"><CheckCircle2 className="w-5 h-5 text-highlight shrink-0" aria-hidden="true" />{x}</li>
              ))}
            </ul>
          </section>

          {/* Kartu auth memakai token kanvas gelap agar kontras input terjaga */}
          <section className="dark w-full max-w-md mx-auto lg:me-0" aria-labelledby="auth-title">
            <div className="card bg-surface p-6 sm:p-8 space-y-5 text-ink">
              <div>
                <h1 id="auth-title" className="font-display font-bold text-2xl">{title}</h1>
                <p className="text-muted mt-1">{sub}</p>
              </div>
              {body}
              {mode !== 'signin' && mode !== 'signup' && (
                <p className="text-center"><Link to="/signin" className="text-sm text-primary-strong hover:underline">{t('auth.back')}</Link></p>
              )}
              <p className="text-[13px] text-muted text-center leading-relaxed">
                {t('auth.terms')}{' '}
                <a href="#terms" className="underline hover:text-ink">{t('auth.termsLink')}</a> · <a href="#privacy" className="underline hover:text-ink">{t('auth.privacyLink')}</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
