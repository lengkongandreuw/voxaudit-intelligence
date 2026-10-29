// Copy landing page (layar #1). Aturan Phase 1: tidak ada klaim hasil klien,
// jumlah pelanggan, rating, atau testimoni tanpa bukti. Angka yang dipakai
// hanya fakta produk. Teks Arab adalah draf untuk direview penutur asli.

import type { Lang } from './i18n';

const en = {
  navProduct: 'Product',
  navHow: 'How it works',
  navEvidence: 'Evidence',
  navWho: 'Who it’s for',
  navSignIn: 'Sign in',
  navCta: 'Run an audit',
  navDemo: 'Open demo',
  navMenu: 'Menu',

  heroKicker: 'Growth intelligence for agencies and the businesses they serve',
  heroTitleA: 'Turn any link into a',
  heroTitleB: 'growth plan',
  heroTitleC: 'you can prove.',
  heroBody: 'VoxAudit reads a business’s website, social profiles, search and answer-engine presence — then shows what’s holding growth back, the source behind every number, and a proposal ready to send.',
  heroInput: 'Website or Instagram link',
  heroPlaceholder: 'cedarco.example or instagram.com/cedarco',
  heroCta: 'Run free audit',
  heroDemo: 'Explore the live demo',
  heroError: 'Paste a website or social profile link, like cedarco.example.',
  heroStatLabel: 'growth pillars, read in one audit',
  heroScroll: 'Scroll',
  chipMeasured: 'Measured · PageSpeed, 12 Oct',
  chipEstimated: 'Est. · third-party panel',
  chipAi: 'Summary · reviewed by your team',

  sourcesLabel: 'Reads public signals from',
  sources: ['Google Search', 'PageSpeed Insights', 'Instagram', 'Facebook Pages', 'Google Business Profile', 'Chat assistants', 'Google Analytics (when connected)'],

  statement: 'Most audits hand you a score and an adjective. VoxAudit hands you the evidence behind every number, the fix that matters most, and the proposal to sell it.',

  pillarsKicker: '01 — Product',
  pillarsTitle: 'Four pillars. One audit. No guesswork.',
  pillars: [
    { name: 'VoxSEO', benefit: 'Find what stops search from sending you customers', detail: 'Blocked pages, slow mobile loads and missing Arabic pairs — each with the URL and date it was found.' },
    { name: 'VoxSocial', benefit: 'Hear what your audience keeps asking for', detail: 'Bios, posting rhythm and the questions buried in comments, from public data or your connected account.' },
    { name: 'VoxAI Visibility', benefit: 'Get named when customers ask a chat assistant', detail: 'Readiness and observed visibility, scored separately — so you know what is fixable and what is measured.' },
    { name: 'Journey & CRO', benefit: 'See where interested visitors give up', detail: 'Observed friction versus hypotheses, clearly labelled until analytics turns them into measurements.' },
  ],

  storyKicker: '02 — How it works',
  storyTitle: 'From a link to a signed proposal, in one loop.',
  steps: [
    { n: '01', title: 'Audit', body: 'Paste a link. Watch each source report in, stage by stage — no fake progress bar.' },
    { n: '02', title: 'Review', body: 'Accept, correct or dismiss each finding. Nothing unreviewed ever reaches a client.' },
    { n: '03', title: 'Explain', body: 'One finding set, three depths: Executive, Marketing and Technical — the same truth for every reader.' },
    { n: '04', title: 'Propose', body: 'Turn accepted findings into a priced proposal from your own service catalog, linked line by line.' },
  ],

  evidenceKicker: '03 — Evidence',
  evidenceTitle: 'Every number shows its receipts.',
  evidenceBody: 'Hover or tap any bar. You will see where it came from, when, and whether it was measured or estimated.',
  evidencePoints: [
    { t: 'Coverage beside every score', d: 'A 68 resting on 78% of the checks reads differently from a 68 resting on 30%.' },
    { t: 'Unavailable is never zero', d: 'If a source fails, the report says so and why — it never draws a convenient zero.' },
    { t: 'Written summaries are marked', d: 'Any machine-written summary carries a marker and passes human review before a client sees it.' },
  ],
  chartTitle: 'Organic search visibility',
  chartSub: 'Share of 40 tracked keywords · sample data',
  chartClient: 'Your client',
  srcMeasured: 'Measured · VoxSEO SERP sample · 12 Oct 2026',
  srcEstimated: 'Estimated · third-party panel · Sep 2026',

  whoKicker: '04 — Who it’s for',
  whoTitle: 'Built for whoever has to explain growth.',
  who: [
    { tab: 'Agencies', title: 'Win the pitch with a report in your brand.', points: ['White-label reports and client portal under your logo and colours', 'Audit a prospect against three competitors before the first call', 'Proposals priced only from your own service catalog'] },
    { tab: 'Consultants', title: 'Agency-grade evidence, one seat.', points: ['The same audit engine and evidence language, without team overhead', 'Executive view for the owner, Technical view for their developer', 'Re-audit on the same methodology to show real progress'] },
    { tab: 'Business owners', title: 'Three things to fix this month, in plain language.', points: ['Why each fix matters and how to measure it', 'Connect Google Analytics to turn hypotheses into measured findings', 'Arabic or English, whichever your team reads'] },
  ],

  langKicker: '05 — Arabic-first',
  langTitle: 'Written for Amman, Riyadh and Dubai — not translated afterwards.',
  langBody: 'Reports, numbers and layouts mirror right-to-left natively. Numbers, URLs and code stay left-to-right where they belong.',
  langToggle: 'Flip the report',

  factsKicker: 'In one audit',
  facts: [
    { n: 4, l: 'growth pillars' },
    { n: 3, l: 'report depths' },
    { n: 2, l: 'languages, RTL native' },
    { n: 1, l: 'reviewed finding set' },
  ],

  finalTitle: 'Your next client is one link away.',
  finalBody: 'Start with a free Digital Health audit. You will see exactly what is collected before anything runs.',
  footerNote: 'Prototype with fictional sample data. No real customer names, results or ratings are shown.',
  footerRights: '© 2026 Voxlumedia™',
  footerLinks: ['Terms of Service', 'Privacy Policy'],
};

type Copy = typeof en;

const ar: Copy = {
  navProduct: 'المنتج',
  navHow: 'كيف يعمل',
  navEvidence: 'الأدلة',
  navWho: 'لمن صُمّم',
  navSignIn: 'تسجيل الدخول',
  navCta: 'ابدأ تدقيقًا',
  navDemo: 'افتح العرض',
  navMenu: 'القائمة',

  heroKicker: 'ذكاء النمو للوكالات والأعمال التي تخدمها',
  heroTitleA: 'حوّل أي رابط إلى',
  heroTitleB: 'خطة نمو',
  heroTitleC: 'يمكنك إثباتها.',
  heroBody: 'يقرأ VoxAudit موقع النشاط التجاري وحساباته الاجتماعية وظهوره في البحث ومحركات الإجابة — ثم يوضّح ما يعيق النمو، ومصدر كل رقم، وعرضًا جاهزًا للإرسال.',
  heroInput: 'رابط الموقع أو إنستغرام',
  heroPlaceholder: 'cedarco.example أو instagram.com/cedarco',
  heroCta: 'ابدأ التدقيق المجاني',
  heroDemo: 'استكشف العرض التجريبي',
  heroError: 'الصق رابط موقع أو حساب تواصل، مثل cedarco.example.',
  heroStatLabel: 'محاور نمو في تدقيق واحد',
  heroScroll: 'مرّر',
  chipMeasured: 'مُقاس · PageSpeed، 12 أكتوبر',
  chipEstimated: 'تقدير · لوحة طرف ثالث',
  chipAi: 'ملخّص · راجعه فريقك',

  sourcesLabel: 'يقرأ الإشارات العامة من',
  sources: ['بحث Google', 'PageSpeed Insights', 'إنستغرام', 'صفحات فيسبوك', 'ملف Google التجاري', 'مساعدات الدردشة', 'Google Analytics (عند الربط)'],

  statement: 'معظم التدقيقات تمنحك رقمًا وصفة. أما VoxAudit فيمنحك الدليل وراء كل رقم، والإصلاح الأهم، والعرض الذي تبيعه به.',

  pillarsKicker: '01 — المنتج',
  pillarsTitle: 'أربعة محاور. تدقيق واحد. بلا تخمين.',
  pillars: [
    { name: 'VoxSEO', benefit: 'اكتشف ما يمنع البحث من إرسال العملاء إليك', detail: 'صفحات محجوبة وتحميل بطيء على الجوال وصفحات عربية بلا مقابل — كلٌّ مع الرابط وتاريخ اكتشافه.' },
    { name: 'VoxSocial', benefit: 'اسمع ما يسأل عنه جمهورك باستمرار', detail: 'النبذة وإيقاع النشر والأسئلة المخفية في التعليقات، من البيانات العامة أو من حسابك المربوط.' },
    { name: 'VoxAI Visibility', benefit: 'كن الاسم الذي يُذكر حين يسأل العملاء مساعد الدردشة', detail: 'الجاهزية والظهور الفعلي بنتيجتين منفصلتين — لتعرف ما يمكن إصلاحه وما هو مُقاس.' },
    { name: 'Journey & CRO', benefit: 'اعرف أين يتوقف الزوار المهتمون', detail: 'احتكاك ملاحَظ مقابل فرضيات، بتوسيم واضح حتى تحوّلها التحليلات إلى قياسات.' },
  ],

  storyKicker: '02 — كيف يعمل',
  storyTitle: 'من رابط إلى عرض موقّع، في حلقة واحدة.',
  steps: [
    { n: '01', title: 'دقِّق', body: 'الصق رابطًا وشاهد كل مصدر يعود بنتائجه مرحلة بمرحلة — بلا شريط تقدّم زائف.' },
    { n: '02', title: 'راجِع', body: 'اقبل كل نتيجة أو صحّحها أو استبعدها. لا يصل شيء غير مُراجَع إلى العميل.' },
    { n: '03', title: 'اشرح', body: 'مجموعة نتائج واحدة بثلاثة مستويات: تنفيذي وتسويقي وتقني — الحقيقة نفسها لكل قارئ.' },
    { n: '04', title: 'اعرض', body: 'حوّل النتائج المقبولة إلى عرض مُسعَّر من كتالوج خدماتك، مرتبط بندًا ببند.' },
  ],

  evidenceKicker: '03 — الأدلة',
  evidenceTitle: 'كل رقم يُظهر إيصاله.',
  evidenceBody: 'مرّر المؤشر أو انقر على أي عمود لترى مصدره وتاريخه، وهل هو مُقاس أم مُقدَّر.',
  evidencePoints: [
    { t: 'التغطية بجانب كل نتيجة', d: 'نتيجة 68 مبنية على 78٪ من الفحوصات تختلف عن 68 مبنية على 30٪.' },
    { t: 'غير المتاح ليس صفرًا', d: 'إذا فشل مصدر، يذكر التقرير ذلك وسببه — ولا يرسم صفرًا مريحًا أبدًا.' },
    { t: 'الملخصات المكتوبة آليًا موسومة', d: 'كل ملخّص مكتوب آليًا يحمل علامة ويمرّ بمراجعة بشرية قبل أن يراه العميل.' },
  ],
  chartTitle: 'الظهور في البحث العضوي',
  chartSub: 'حصة 40 كلمة مفتاحية متابَعة · بيانات تجريبية',
  chartClient: 'عميلك',
  srcMeasured: 'مُقاس · عيّنة نتائج VoxSEO · 12 أكتوبر 2026',
  srcEstimated: 'تقديري · لوحة طرف ثالث · سبتمبر 2026',

  whoKicker: '04 — لمن صُمّم',
  whoTitle: 'لكل من عليه أن يشرح النمو.',
  who: [
    { tab: 'الوكالات', title: 'اربح العرض بتقرير يحمل علامتك.', points: ['تقارير وبوابة عميل بعلامة بيضاء وبشعارك وألوانك', 'دقّق عميلًا محتملًا مقابل ثلاثة منافسين قبل أول مكالمة', 'عروض مُسعّرة من كتالوج خدماتك فقط'] },
    { tab: 'المستشارون', title: 'أدلة بمستوى الوكالات، بمقعد واحد.', points: ['محرّك التدقيق ولغة الأدلة نفسها دون أعباء الفريق', 'عرض تنفيذي للمالك وعرض تقني لمطوّره', 'أعد التدقيق بالمنهجية نفسها لتُظهر تقدمًا حقيقيًا'] },
    { tab: 'أصحاب الأعمال', title: 'ثلاثة أمور تُصلحها هذا الشهر، بلغة واضحة.', points: ['لماذا يهم كل إصلاح وكيف تقيسه', 'اربط Google Analytics لتحويل الفرضيات إلى نتائج مُقاسة', 'بالعربية أو الإنجليزية، كما يقرأ فريقك'] },
  ],

  langKicker: '05 — العربية أولًا',
  langTitle: 'مكتوب لعمّان والرياض ودبي — لا مُترجَم لاحقًا.',
  langBody: 'تنعكس التقارير والأرقام والتخطيطات من اليمين إلى اليسار بشكل أصيل، وتبقى الأرقام والروابط والشيفرة من اليسار إلى اليمين حيث يجب.',
  langToggle: 'اقلب التقرير',

  factsKicker: 'في تدقيق واحد',
  facts: [
    { n: 4, l: 'محاور نمو' },
    { n: 3, l: 'مستويات تقرير' },
    { n: 2, l: 'لغتان، دعم أصيل لليمين إلى اليسار' },
    { n: 1, l: 'مجموعة نتائج مُراجَعة' },
  ],

  finalTitle: 'عميلك القادم على بُعد رابط واحد.',
  finalBody: 'ابدأ بتدقيق مجاني للصحة الرقمية، وسترى بدقة ما سيُجمع قبل تشغيل أي شيء.',
  footerNote: 'نموذج أولي ببيانات تجريبية خيالية. لا تُعرض أسماء أو نتائج أو تقييمات لعملاء حقيقيين.',
  footerRights: '© 2026 Voxlumedia™',
  footerLinks: ['شروط الخدمة', 'سياسة الخصوصية'],
};

export const LANDING: Record<Lang, Copy> = { en, ar };
