import {
  LayoutDashboard, Building2, PlusCircle, Activity, Gauge, Share2, Search, Sparkles, Swords,
  Route, FileText, Lightbulb, CalendarRange, FileSignature, Users, Palette, Link2, UserCog,
  Plug, CreditCard, Settings, ShieldCheck, type LucideIcon,
} from 'lucide-react';
import type { Role } from './prototype';
import type { TKey } from './i18n';

export type NavItem = {
  id: string;
  label: TKey;
  icon: LucideIcon;
  path: string;            // relatif terhadap /w/:ws/c/:client
  roles: Role[];
  screen?: number;         // nomor layar di inventory Phase 1
};

export type NavGroup = { id: string; label: TKey; items: NavItem[] };

const ALL_APP: Role[] = ['platform', 'owner', 'member', 'consultant', 'business'];

// Matriks akses dari tabel "What each role sees" di Phase 1.
export const NAV: NavGroup[] = [
  {
    id: 'workspace', label: 'nav.workspace', items: [
      { id: 'dashboard', label: 'nav.dashboard', icon: LayoutDashboard, path: 'dashboard', roles: ALL_APP, screen: 3 },
      { id: 'profile', label: 'nav.profile', icon: Building2, path: 'profile', roles: ALL_APP, screen: 4 },
      { id: 'create', label: 'nav.createAudit', icon: PlusCircle, path: 'audits/new', roles: ALL_APP, screen: 5 },
      { id: 'progress', label: 'nav.progress', icon: Activity, path: 'audits/progress', roles: ALL_APP, screen: 6 },
    ],
  },
  {
    id: 'intelligence', label: 'nav.intelligence', items: [
      { id: 'overview', label: 'nav.overview', icon: Gauge, path: 'intelligence', roles: ALL_APP, screen: 7 },
      { id: 'voxsocial', label: 'nav.voxsocial', icon: Share2, path: 'intelligence/social', roles: ALL_APP, screen: 8 },
      { id: 'voxseo', label: 'nav.voxseo', icon: Search, path: 'intelligence/seo', roles: ALL_APP, screen: 9 },
      { id: 'voxai', label: 'nav.voxai', icon: Sparkles, path: 'intelligence/ai', roles: ALL_APP, screen: 10 },
      { id: 'competitive', label: 'nav.competitive', icon: Swords, path: 'intelligence/competitive', roles: ALL_APP, screen: 11 },
      { id: 'journey', label: 'nav.journey', icon: Route, path: 'intelligence/journey', roles: ALL_APP, screen: 12 },
      { id: 'report', label: 'nav.report', icon: FileText, path: 'reports/latest', roles: ALL_APP, screen: 13 },
    ],
  },
  {
    id: 'growth', label: 'nav.growth', items: [
      { id: 'strategy', label: 'nav.strategy', icon: Lightbulb, path: 'growth/strategy', roles: ALL_APP, screen: 15 },
      { id: 'roadmap', label: 'nav.roadmap', icon: CalendarRange, path: 'growth/roadmap', roles: ALL_APP, screen: 16 },
      // Business user: strategi & roadmap saja. Member: lihat proposal, tanpa edit harga.
      { id: 'proposals', label: 'nav.proposals', icon: FileSignature, path: 'growth/proposals', roles: ['platform', 'owner', 'member', 'consultant'], screen: 17 },
    ],
  },
  {
    id: 'agency', label: 'nav.agency', items: [
      { id: 'clients', label: 'nav.clients', icon: Users, path: 'agency/clients', roles: ['platform', 'owner', 'member'], screen: 18 },
      { id: 'branding', label: 'nav.branding', icon: Palette, path: 'agency/branding', roles: ['platform', 'owner', 'consultant'], screen: 19 },
      { id: 'sharing', label: 'nav.sharing', icon: Link2, path: 'agency/sharing', roles: ['platform', 'owner'], screen: 20 },
    ],
  },
  {
    id: 'administration', label: 'nav.administration', items: [
      { id: 'team', label: 'nav.team', icon: UserCog, path: 'admin/team', roles: ['platform', 'owner'], screen: 23 },
      { id: 'integrations', label: 'nav.integrations', icon: Plug, path: 'admin/integrations', roles: ['platform', 'owner', 'consultant'], screen: 24 },
      { id: 'billing', label: 'nav.billing', icon: CreditCard, path: 'admin/billing', roles: ['platform', 'owner', 'consultant'], screen: 21 },
      { id: 'settings', label: 'nav.settings', icon: Settings, path: 'admin/settings', roles: ['platform', 'owner', 'consultant', 'business'] },
    ],
  },
];

// Admin console adalah permukaan terpisah; hanya platform admin yang melihatnya.
export const PLATFORM_ITEM: NavItem = {
  id: 'admin-console', label: 'nav.adminConsole', icon: ShieldCheck, path: '/admin', roles: ['platform'], screen: 22,
};

export function navFor(role: Role): NavGroup[] {
  return NAV
    .map((g) => ({ ...g, items: g.items.filter((i) => i.roles.includes(role)) }))
    .filter((g) => g.items.length > 0);
}

export const ALL_ITEMS: NavItem[] = [...NAV.flatMap((g) => g.items), PLATFORM_ITEM];

// Ringkasan layar dari inventory Phase 1, dipakai di halaman "Planned screen".
export const SCREEN_INFO: Record<number, { sprint: number; rule: string; states: string }> = {
  4: { sprint: 2, rule: 'Labels brand vs location vs organization data', states: 'Single vs multi-location' },
  5: { sprint: 2, rule: 'Credit estimate before run', states: 'Edit from review, insufficient credits' },
  6: { sprint: 2, rule: 'Stage status, never a fake percentage', states: 'Running, source failed, partial complete, retry' },
  7: { sprint: 3, rule: 'Score shown with evidence-coverage indicator', states: 'Full coverage, low coverage' },
  8: { sprint: 3, rule: 'Source badge per metric; unavailable shown as unavailable', states: 'Public-only, API, connected' },
  9: { sprint: 3, rule: 'Each finding has URL, evidence, date', states: 'Critical-only, clean site' },
  10: { sprint: 3, rule: 'Readiness and observed visibility are separate scores', states: 'No tests yet, one run, history' },
  11: { sprint: 3, rule: 'Measured vs estimated values visually distinct', states: 'Uneven data coverage' },
  12: { sprint: 3, rule: '“Observed” vs “Hypothesis” labels', states: 'Public-only vs analytics connected' },
  13: { sprint: 3, rule: 'One finding set powers all three views', states: 'Executive / Marketing / Technical views, PDF' },
  15: { sprint: 4, rule: 'Each recommendation links to its findings', states: 'Generated, edited, rejected' },
  16: { sprint: 4, rule: 'Expected outcomes worded as hypotheses', states: 'Board and timeline views' },
  17: { sprint: 4, rule: 'Prices only from the workspace catalog', states: 'No catalog yet, draft, sent' },
  18: { sprint: 4, rule: 'Client switch clears context', states: '1 client, 40 clients' },
  19: { sprint: 4, rule: 'Methodology section cannot be removed', states: 'Live preview LTR and RTL' },
  20: { sprint: 4, rule: 'Private by default', states: 'Link expired, revoked, password' },
  21: { sprint: 4, rule: 'Usage from server, prices unset until approved', states: 'Near limit, over limit' },
  22: { sprint: 4, rule: 'Tenant access is logged', states: 'Failed job investigation' },
  23: { sprint: 4, rule: 'Role preview of what the user will see', states: 'Pending invite' },
  24: { sprint: 4, rule: 'What each integration adds to the report', states: 'Connected, expired, error' },
};
