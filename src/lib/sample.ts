// DATA CONTOH — fiktif seluruhnya (aturan "Sample data rules" Phase 1).
// Sengaja memuat celah: satu sumber gagal, satu metrik pesaing berupa estimasi,
// satu metrik yang tidak berlaku, dan satu modul dengan bukti tidak cukup.

import type { DashState } from './prototype';

export type L = { en: string; ar: string };
export type Evidence = 'measured' | 'connected' | 'estimated' | 'ai' | 'unavailable' | 'na';
export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type Client = { id: string; name: L; locations: L; defaultState: DashState };
export type Workspace = { id: string; kind: 'agency' | 'consultant' | 'business'; name: L; clients: Client[] };

const cedar: Client = {
  id: 'cedar',
  name: { en: 'Cedar & Co. Dental', ar: 'سيدار آند كو لطب الأسنان' },
  locations: { en: 'Amman · Fairfax', ar: 'عمّان · فيرفاكس' },
  defaultState: 'populated',
};

export const WORKSPACES: Record<'agency' | 'consultant' | 'business', Workspace> = {
  agency: {
    id: 'northwind', kind: 'agency',
    name: { en: 'Northwind Growth Studio', ar: 'استوديو نورثويند للنمو' },
    clients: [
      cedar,
      { id: 'olive', name: { en: 'Olive Grove Bakery', ar: 'مخبز بستان الزيتون' }, locations: { en: 'Amman', ar: 'عمّان' }, defaultState: 'empty' },
      { id: 'summit', name: { en: 'Summit Physio', ar: 'سميت للعلاج الطبيعي' }, locations: { en: 'Dubai', ar: 'دبي' }, defaultState: 'partial' },
    ],
  },
  consultant: {
    id: 'rana-advisory', kind: 'consultant',
    name: { en: 'Rana Advisory', ar: 'رنا للاستشارات' },
    clients: [cedar],
  },
  business: {
    id: 'cedar-co', kind: 'business',
    name: { en: 'Cedar & Co. Dental', ar: 'سيدار آند كو لطب الأسنان' },
    clients: [cedar],
  },
};

export type Kpi = {
  id: string;
  label: L;
  value: string | null;      // null = tidak tersedia / tidak berlaku
  unit?: L;
  evidence: Evidence;
  definition: L;
  period: L;
  source: L;
  reason?: L;                // wajib bila value null
};

export const KPIS: Kpi[] = [
  {
    id: 'search', label: { en: 'Organic search visibility', ar: 'الظهور في البحث العضوي' },
    value: '18', unit: { en: '% of tracked keywords', ar: '٪ من الكلمات المتابَعة' }, evidence: 'measured',
    definition: { en: 'Share of 40 tracked dental keywords where the site ranks on page 1.', ar: 'نسبة الكلمات المفتاحية الأربعين المتعلقة بطب الأسنان التي يظهر فيها الموقع في الصفحة الأولى.' },
    period: { en: 'Snapshot, 12 Oct 2026', ar: 'لقطة بتاريخ 12 أكتوبر 2026' },
    source: { en: 'VoxSEO SERP sample, Amman + Fairfax', ar: 'عيّنة نتائج البحث من VoxSEO، عمّان + فيرفاكس' },
  },
  {
    id: 'lcp', label: { en: 'Mobile page load (LCP)', ar: 'سرعة تحميل الجوال (LCP)' },
    value: '4.1', unit: { en: 's · target 2.5 s', ar: 'ث · الهدف 2.5 ث' }, evidence: 'measured',
    definition: { en: 'Largest Contentful Paint on the homepage, mobile profile.', ar: 'زمن ظهور أكبر عنصر في الصفحة الرئيسية على الجوال.' },
    period: { en: 'Median of 3 runs, 12 Oct 2026', ar: 'الوسيط لثلاث محاولات، 12 أكتوبر 2026' },
    source: { en: 'Google PageSpeed Insights', ar: 'Google PageSpeed Insights' },
  },
  {
    id: 'ig', label: { en: 'Instagram engagement', ar: 'التفاعل على إنستغرام' },
    value: '2.3', unit: { en: '% per post', ar: '٪ لكل منشور' }, evidence: 'measured',
    definition: { en: 'Public likes + comments ÷ followers, averaged over the last 30 posts.', ar: 'الإعجابات والتعليقات العامة ÷ المتابعين، كمتوسط لآخر ٣٠ منشورًا.' },
    period: { en: 'Last 30 posts to 12 Oct 2026', ar: 'آخر ٣٠ منشورًا حتى 12 أكتوبر 2026' },
    source: { en: 'Public profile data (no account connected)', ar: 'بيانات الحساب العامة (بدون ربط حساب)' },
  },
  {
    id: 'visits', label: { en: 'Monthly website visits', ar: 'زيارات الموقع الشهرية' },
    value: '3,400', unit: { en: 'visits', ar: 'زيارة' }, evidence: 'estimated',
    definition: { en: 'Modelled monthly visits. Connect Google Analytics to replace with measured data.', ar: 'زيارات شهرية مقدَّرة. اربط Google Analytics لاستبدالها ببيانات مقاسة.' },
    period: { en: 'Sep 2026', ar: 'سبتمبر 2026' },
    source: { en: 'Third-party traffic panel', ar: 'لوحة زيارات من طرف ثالث' },
  },
  {
    id: 'gbp', label: { en: 'Google rating — Fairfax', ar: 'تقييم Google — فيرفاكس' },
    value: null, evidence: 'unavailable',
    definition: { en: 'Average star rating on the Google Business Profile for this location.', ar: 'متوسط التقييم في ملف Google التجاري لهذا الفرع.' },
    period: { en: '12 Oct 2026', ar: '12 أكتوبر 2026' },
    source: { en: 'Google Business Profile', ar: 'ملف Google التجاري' },
    reason: { en: 'Source failed: profile could not be fetched. Retry from the progress center.', ar: 'فشل المصدر: تعذّر جلب الملف. أعد المحاولة من مركز التقدّم.' },
  },
  {
    id: 'app', label: { en: 'App store rating', ar: 'تقييم متجر التطبيقات' },
    value: null, evidence: 'na',
    definition: { en: 'Average rating across Google Play and the App Store.', ar: 'متوسط التقييم في Google Play وApp Store.' },
    period: { en: '—', ar: '—' },
    source: { en: 'App stores', ar: 'متاجر التطبيقات' },
    reason: { en: 'Not applicable: this business has no mobile app.', ar: 'لا ينطبق: لا يملك هذا النشاط تطبيقًا للجوال.' },
  },
];

export type ModuleSummary = {
  id: 'voxseo' | 'voxsocial' | 'voxai' | 'journey';
  name: L;
  score: number | null;
  coverage: number;
  evidence: Evidence;
  note: L;
};

export const MODULES: ModuleSummary[] = [
  { id: 'voxseo', name: { en: 'VoxSEO', ar: 'VoxSEO' }, score: 61, coverage: 92, evidence: 'measured',
    note: { en: '214 pages crawled · 3 critical issues', ar: 'فحص 214 صفحة · 3 مشكلات حرجة' } },
  { id: 'voxsocial', name: { en: 'VoxSocial', ar: 'VoxSocial' }, score: 74, coverage: 70, evidence: 'measured',
    note: { en: 'Instagram + Facebook public data · LinkedIn unavailable', ar: 'بيانات عامة من إنستغرام وفيسبوك · لينكدإن غير متاح' } },
  { id: 'voxai', name: { en: 'VoxAI Visibility', ar: 'VoxAI — الظهور' }, score: 55, coverage: 64, evidence: 'measured',
    note: { en: 'Readiness only · no assistant tests run yet', ar: 'الجاهزية فقط · لم تُجرَ اختبارات على المساعدات بعد' } },
  { id: 'journey', name: { en: 'Journey & CRO', ar: 'الرحلة والتحويل' }, score: null, coverage: 28, evidence: 'unavailable',
    note: { en: 'Score withheld — insufficient evidence. Connect analytics.', ar: 'النتيجة محجوبة — أدلة غير كافية. اربط التحليلات.' } },
];

export const OVERALL = { score: 68, coverage: 78, methodology: 'v2.1' };

export type Finding = {
  id: string;
  title: L;
  module: L;
  severity: Severity;
  evidence: Evidence;
  status: 'toReview' | 'accepted';
  url?: string;
};

export const FINDINGS: Finding[] = [
  { id: 'f-101', severity: 'critical', evidence: 'measured', status: 'toReview', url: '/book-appointment',
    module: { en: 'VoxSEO', ar: 'VoxSEO' },
    title: { en: 'Booking page is blocked from search engines (noindex)', ar: 'صفحة الحجز محجوبة عن محركات البحث (noindex)' } },
  { id: 'f-102', severity: 'high', evidence: 'measured', status: 'toReview',
    module: { en: 'VoxSocial', ar: 'VoxSocial' },
    title: { en: 'No booking link in Instagram bio; 31% of comments ask about price or availability', ar: 'لا يوجد رابط حجز في نبذة إنستغرام؛ و31٪ من التعليقات تسأل عن السعر أو المواعيد' } },
  { id: 'f-103', severity: 'high', evidence: 'measured', status: 'accepted', url: '/ar/',
    module: { en: 'VoxSEO', ar: 'VoxSEO' },
    title: { en: '14 of 22 Arabic pages have no hreflang pair', ar: '14 من أصل 22 صفحة عربية بلا وسم hreflang مقابل' } },
  { id: 'f-104', severity: 'medium', evidence: 'measured', status: 'toReview',
    module: { en: 'VoxAI Visibility', ar: 'VoxAI — الظهور' },
    title: { en: 'No FAQ content or Dentist schema for AI assistants to cite', ar: 'لا يوجد محتوى أسئلة شائعة ولا مخطط Dentist لتستشهد به المساعدات الذكية' } },
  { id: 'f-105', severity: 'medium', evidence: 'estimated', status: 'toReview',
    module: { en: 'Competitive', ar: 'المنافسون' },
    title: { en: 'Juniper Smile Studio gets an estimated 2.4× more organic traffic', ar: 'يحصل Juniper Smile Studio على زيارات عضوية تُقدَّر بـ 2.4 ضعف' } },
];

export const AI_SUMMARY: L = {
  en: 'Patients are looking for Cedar & Co. but hit dead ends: the booking page cannot be found in search and Instagram has no way to book. Fixing those two paths is the fastest route to more appointments this month.',
  ar: 'يبحث المرضى عن سيدار آند كو لكنهم يصطدمون بطرق مسدودة: صفحة الحجز لا تظهر في البحث، ولا توجد طريقة للحجز عبر إنستغرام. إصلاح هذين المسارين هو أسرع طريق لزيادة المواعيد هذا الشهر.',
};

export type CompetitorPoint = { name: L; value: number; evidence: Evidence; isClient?: boolean };

export const COMPETITORS: CompetitorPoint[] = [
  { name: { en: 'Cedar & Co. Dental', ar: 'سيدار آند كو' }, value: 18, evidence: 'measured', isClient: true },
  { name: { en: 'Juniper Smile Studio', ar: 'Juniper Smile Studio' }, value: 31, evidence: 'measured' },
  { name: { en: 'Harbor Dental Group', ar: 'Harbor Dental Group' }, value: 24, evidence: 'measured' },
  { name: { en: 'Aldara Family Dentistry', ar: 'Aldara Family Dentistry' }, value: 12, evidence: 'estimated' },
];

export type AuditRow = {
  id: string; date: L; type: L; coverage: number; score: number | null; status: 'complete' | 'partial'; method: string;
};

export const AUDITS: AuditRow[] = [
  { id: 'run-0412', date: { en: '12 Oct 2026', ar: '12 أكتوبر 2026' }, type: { en: 'Complete Growth Intelligence', ar: 'ذكاء النمو الشامل' }, coverage: 78, score: 68, status: 'partial', method: 'v2.1' },
  { id: 'run-0388', date: { en: '3 Aug 2026', ar: '3 أغسطس 2026' }, type: { en: 'Digital Health', ar: 'الصحة الرقمية' }, coverage: 85, score: 63, status: 'complete', method: 'v2.1' },
  { id: 'run-0301', date: { en: '14 May 2026', ar: '14 مايو 2026' }, type: { en: 'Digital Health', ar: 'الصحة الرقمية' }, coverage: 81, score: 57, status: 'complete', method: 'v2.0' },
];

export type Stage = { id: string; label: L; status: 'complete' | 'running' | 'failed' | 'queued'; detail: L };

export const STAGES: Stage[] = [
  { id: 's1', status: 'complete', label: { en: 'Website crawl', ar: 'فحص الموقع' }, detail: { en: '96 pages', ar: '96 صفحة' } },
  { id: 's2', status: 'complete', label: { en: 'Search visibility', ar: 'الظهور في البحث' }, detail: { en: '40 keywords', ar: '40 كلمة مفتاحية' } },
  { id: 's3', status: 'running', label: { en: 'Social public data', ar: 'بيانات التواصل العامة' }, detail: { en: 'Instagram, Facebook', ar: 'إنستغرام، فيسبوك' } },
  { id: 's4', status: 'failed', label: { en: 'Google Business Profile', ar: 'ملف Google التجاري' }, detail: { en: 'Could not fetch profile', ar: 'تعذّر جلب الملف' } },
  { id: 's5', status: 'queued', label: { en: 'AI visibility readiness', ar: 'جاهزية الظهور في الذكاء الاصطناعي' }, detail: { en: 'Waiting', ar: 'في الانتظار' } },
  { id: 's6', status: 'queued', label: { en: 'Competitor collection', ar: 'جمع بيانات المنافسين' }, detail: { en: '3 competitors', ar: '3 منافسين' } },
];

export function bandOf(score: number): 'critical' | 'needsWork' | 'solid' | 'strong' {
  // Ambang usulan prototype — perlu disetujui bersama metodologi skor.
  if (score < 50) return 'critical';
  if (score < 70) return 'needsWork';
  if (score < 85) return 'solid';
  return 'strong';
}
