import { Link } from 'react-router';
import {
  Baby,
  Briefcase,
  CheckCircle,
  ExternalLink,
  GraduationCap,
  Home,
  Info,
  RefreshCw,
  Tag,
  User,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { Plan } from '@/hooks/usePlans';
import { getActiveMobileProviderPromotion } from '@/lib/mobileProviderConfig';
import { getOperatorLogo } from '@/lib/operatorLogos';

type OperatorSlug =
  | 'vimla'
  | 'fello'
  | 'comviq'
  | 'tre'
  | 'tele2'
  | 'telenor'
  | 'telia';

type SeoContentSectionProps = {
  plans: Plan[];
};

const operatorLabels: Record<OperatorSlug, string> = {
  vimla: 'Vimla / فيملا',
  fello: 'Fello / فيلّو',
  comviq: 'Comviq / كومفيك',
  tre: 'Tre / تري',
  tele2: 'Tele2 / تيلي 2',
  telenor: 'Telenor / تيلينور',
  telia: 'Telia / تيليا',
};

const operatorInternalLinks: Record<OperatorSlug, string> = {
  vimla: '/mobilabonnemang/vimla',
  fello: '/mobilabonnemang/fello',
  comviq: '/mobilabonnemang/comviq',
  tre: '/mobilabonnemang/tre',
  tele2: '/mobilabonnemang/tele2',
  telenor: '/mobilabonnemang/telenor',
  telia: '/mobilabonnemang/telia',
};

const operatorSlugs: OperatorSlug[] = [
  'vimla',
  'fello',
  'comviq',
  'tre',
  'tele2',
  'telenor',
  'telia',
];

function normalizeOperator(value: string) {
  return value.trim().toLowerCase();
}

function planMatchesOperator(plan: Plan, operatorSlug: OperatorSlug) {
  const title = normalizeOperator(plan.title);

  if (operatorSlug === 'tre') {
    return title === 'tre' || title === '3' || title.includes('tre');
  }

  return title.includes(operatorSlug);
}

function getOperatorPlan(plans: Plan[], operatorSlug: OperatorSlug) {
  return plans.find((plan) => planMatchesOperator(plan, operatorSlug));
}

function getOutboundUrl(plan?: Plan) {
  if (!plan) return null;
  const activePromotion = getActiveMobileProviderPromotion(plan.title);
  return activePromotion?.promotionUrl || plan.sourceUrl || null;
}

function trackAndOpenOperator(plan: Plan, operatorSlug: OperatorSlug) {
  const ctaUrl = getOutboundUrl(plan);
  if (!ctaUrl) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'cta_click',
    operator: plan.title,
    plan_name: plan.subtitle,
    price: plan.price,
    source: 'mobile_hub_content',
    operator_slug: operatorSlug,
  });

  window.open(ctaUrl, '_blank', 'noopener,noreferrer');
}

function InternalTextLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link to={to} className="font-bold text-green-800 underline decoration-emerald-300 underline-offset-4 hover:text-green-900">
      {children}
    </Link>
  );
}

function OperatorActionLink({
  slug,
  plans,
  children,
}: {
  slug: OperatorSlug;
  plans: Plan[];
  children: ReactNode;
}) {
  const plan = getOperatorPlan(plans, slug);
  const outboundUrl = getOutboundUrl(plan);

  if (!plan || !outboundUrl) {
    return (
      <Link
        to={operatorInternalLinks[slug]}
        data-operator-fallback={slug}
        className="font-bold text-green-800 underline decoration-emerald-300 underline-offset-4 hover:text-green-900"
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      data-operator-outbound={slug}
      onClick={() => trackAndOpenOperator(plan, slug)}
      className="inline-flex cursor-pointer items-center gap-1 font-bold text-green-800 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-green-900"
    >
      {children}
      <ExternalLink className="h-3.5 w-3.5" />
    </button>
  );
}

function OperatorLogoLink({ slug, plans }: { slug: OperatorSlug; plans: Plan[] }) {
  const plan = getOperatorPlan(plans, slug);
  const outboundUrl = getOutboundUrl(plan);
  const logo = getOperatorLogo(slug);
  const label = operatorLabels[slug];
  const logoContent = logo ? (
    <img src={logo} alt={label} className="h-10 max-w-[112px] object-contain" />
  ) : (
    <span className="text-lg font-black text-slate-900">{label}</span>
  );

  if (!plan || !outboundUrl) {
    return (
      <Link
        to={operatorInternalLinks[slug]}
        data-operator-logo-fallback={slug}
        className="mb-3 inline-flex h-12 items-center justify-center rounded-xl px-3 transition-transform hover:-translate-y-0.5"
        aria-label={`شاهد عروض ${label}`}
      >
        {logoContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      data-operator-logo-outbound={slug}
      onClick={() => trackAndOpenOperator(plan, slug)}
      className="mb-3 inline-flex h-12 cursor-pointer items-center justify-center rounded-xl px-3 transition-transform hover:-translate-y-0.5"
      aria-label={`شاهد عروض ${label}`}
    >
      {logoContent}
    </button>
  );
}

function OperatorOfferCard({ slug, plans }: { slug: OperatorSlug; plans: Plan[] }) {
  return (
    <li className="rounded-[12px] border border-emerald-100 bg-white px-4 py-4 text-center shadow-sm transition-shadow hover:shadow-md">
      <OperatorLogoLink slug={slug} plans={plans} />
      <div className="text-base leading-relaxed">
        شاهد عروض <OperatorActionLink slug={slug} plans={plans}>{operatorLabels[slug]}</OperatorActionLink>
      </div>
    </li>
  );
}

function TrustChip({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-[12px] border border-emerald-200/60 bg-emerald-50 px-4 py-2">
      <Icon className="h-4 w-4 text-emerald-600" />
      <span className="text-sm font-bold text-emerald-800">{children}</span>
    </div>
  );
}

function Section({
  title,
  children,
  className = '',
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mb-12 ${className}`}>
      <h2 className="mb-4 text-2xl font-black text-slate-900 md:text-3xl">{title}</h2>
      <div className="space-y-4 text-base leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
          <span className="leading-relaxed text-slate-700">{item}</span>
        </li>
      ))}
    </ul>
  );
}

const targetGroups = [
  {
    icon: GraduationCap,
    title: 'الطلاب',
    description:
      'إذا كنت طالبًا، قد يكون السعر الشهري من أهم العوامل. قارن بين سعر الحملة والسعر بعد الحملة حتى لا تصبح الباقة أغلى لاحقًا.',
  },
  {
    icon: User,
    title: 'كبار السن',
    description:
      'باقات كبار السن أو المستخدمين الذين لا يحتاجون إلى إنترنت كثير قد تكون أبسط وأرخص. في هذه الحالة قد تكون التغطية وخدمة العملاء مهمة بقدر أهمية السعر.',
  },
  {
    icon: Baby,
    title: 'الأطفال والشباب',
    description:
      'للمستخدمين الأصغر سنًا، قد تكون الباقة بدون التزام وخيار التحكم في التكلفة أهم من كمية الإنترنت الكبيرة.',
  },
  {
    icon: Home,
    title: 'العائلات',
    description:
      'إذا كان أكثر من شخص في العائلة يحتاج إلى اشتراك جوال، قد يكون من المفيد مقارنة عدة باقات أو اختيار نفس الشبكة لتسهيل الإدارة والدعم.',
  },
  {
    icon: Briefcase,
    title: 'الأعمال',
    description:
      'باقات الأعمال قد تختلف عن الباقات الشخصية. قارن فترة الالتزام، الدعم، ما هو مشمول أثناء السفر، وما إذا كانت الأسعار تشمل ضريبة القيمة المضافة أم لا.',
  },
];

const faqItems = [
  {
    question: 'ما هي أرخص باقة جوال حاليًا؟',
    answer: (
      <>
        تتغير أرخص باقة جوال حسب العروض الحالية، كمية الإنترنت والسعر بعد انتهاء الحملة. لذلك من الأفضل مقارنة الباقات بانتظام. يمكنك قراءة المزيد في دليلنا:{' '}
        <InternalTextLink to="/mobilabonnemang/billigaste">أرخص اشتراك جوال في السويد</InternalTextLink>
      </>
    ),
  },
  {
    question: 'ماذا يعني الإنترنت غير المحدود؟',
    answer:
      'الإنترنت غير المحدود يعني أن الباقة لا تضع حدًا تقليديًا لكمية البيانات، لكن الشروط قد تختلف بين المشغّلين. لذلك من المهم قراءة شروط الباقة قبل الطلب.',
  },
  {
    question: 'هل الباقات بدون التزام دائمًا الأفضل؟',
    answer: (
      <>
        ليست دائمًا الأفضل، لكنها تمنحك مرونة أكبر. إذا كنت تريد تغيير الاشتراك عند ظهور عرض أفضل، فقد تكون الباقات بدون التزام خيارًا جيدًا. اقرأ المزيد:{' '}
        <InternalTextLink to="/mobilabonnemang/utan-bindningstid">باقات جوال بدون التزام</InternalTextLink>
      </>
    ),
  },
  {
    question: 'ما هي أفضل شبكة في السويد؟',
    answer:
      'يعتمد ذلك على المكان الذي تعيش فيه وتستخدم فيه الهاتف. في السويد توجد عدة شبكات رئيسية مثل Telia، Tele2، Tre وTelenor. من الأفضل التحقق من التغطية في منطقتك قبل اختيار الباقة.',
  },
  {
    question: 'هل يمكنني الاحتفاظ برقمي عند تغيير الباقة؟',
    answer:
      'في معظم الحالات يمكنك الاحتفاظ برقمك عند تغيير المشغّل. عادةً تطلب نقل الرقم عند التسجيل لدى المشغّل الجديد.',
  },
  {
    question: 'هل يمكن تغيير الباقة عند انتهاء الحملة؟',
    answer:
      'إذا كانت الباقة بدون التزام، يكون التغيير غالبًا أسهل. أما إذا كانت هناك فترة التزام، فيجب التحقق من الشروط قبل التغيير.',
  },
  {
    question: 'كم من الإنترنت أحتاج شهريًا؟',
    answer: (
      <>
        يعتمد ذلك على استخدامك. إذا كنت تستخدم WiFi غالبًا، قد تكفيك باقة صغيرة. إذا كنت تشاهد الفيديو أو تستخدم الهاتف كثيرًا خارج المنزل، فقد تحتاج إلى إنترنت أكثر. اقرأ دليلنا:{' '}
        <InternalTextLink to="/guider/hur-mycket-surf">كم إنترنت أحتاج في اشتراك الجوال؟</InternalTextLink>
      </>
    ),
  },
  {
    question: 'ماذا أقارن لأعرف التكلفة الحقيقية على المدى الطويل؟',
    answer:
      'قارن سعر الحملة، السعر بعد الحملة، مدة العرض، كمية الإنترنت، فترة الالتزام وأي رسوم إضافية محتملة.',
  },
  {
    question: 'هل تعمل باقتي داخل الاتحاد الأوروبي والمنطقة الاقتصادية الأوروبية؟',
    answer:
      'معظم الباقات تشمل استخدامًا داخل الاتحاد الأوروبي والمنطقة الاقتصادية الأوروبية، لكن كمية الإنترنت المتاحة وشروط الاستخدام قد تختلف بين المشغّلين.',
  },
];

export function SeoContentSection({ plans }: SeoContentSectionProps) {
  return (
    <section className="mx-auto mt-12 max-w-4xl px-[16px] py-[24px]">
      <div className="mb-12">
        <h2 className="mb-4 text-3xl font-black text-slate-900 md:text-4xl">
          قارن باقات الجوال في السويد واعثر على أرخص اشتراك
        </h2>
        <div className="space-y-4 text-lg leading-relaxed text-slate-700">
          <p>
            هنا يمكنك مقارنة باقات الجوال واشتراكات الهاتف المحمول في السويد في مكان واحد. قارن السعر، كمية الإنترنت، فترة الالتزام، الشبكة والعروض الحالية، ثم انتقل مباشرة إلى موقع المشغّل عندما تجد الباقة المناسبة.
          </p>
          <p className="text-base text-slate-600">
            نحدّث الأسعار والشروط يوميًا حتى تحصل على صورة واضحة عن العروض المتاحة الآن.
          </p>
        </div>
      </div>

      <div className="mb-12 flex flex-wrap gap-3">
        <TrustChip icon={RefreshCw}>يُحدَّث يوميًا</TrustChip>
        <TrustChip icon={CheckCircle}>مجاني للاستخدام</TrustChip>
        <TrustChip icon={Tag}>نفس سعر المشغّل</TrustChip>
        <TrustChip icon={Info}>روابط إعلانية واضحة</TrustChip>
      </div>

      <section className="mb-12 rounded-[16px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-black text-slate-900">كيف تعمل خدمة مقارنة باقات الجوال؟</h2>
        <ol className="space-y-3">
          {[
            'اختر كمية الإنترنت التي تناسب استخدامك، مثل 5 جيجابايت، 20 جيجابايت أو إنترنت غير محدود.',
            'قارن السعر، فترة الالتزام، الشبكة والسعر بعد انتهاء الحملة.',
            'انقر على "شاهد العرض" للانتقال إلى موقع المشغّل وإتمام الطلب.',
          ].map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-green-700 text-sm font-bold text-white">
                {index + 1}
              </span>
              <span className="pt-0.5 leading-relaxed text-slate-700">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <Section title="أرخص اشتراك جوال في السويد">
        <p>
          إذا كنت تبحث عن أرخص اشتراك جوال في السويد، فمن المهم ألا تنظر فقط إلى السعر الأولي. بعض الباقات تبدأ بسعر منخفض خلال الأشهر الأولى، ثم تنتقل بعد ذلك إلى السعر العادي.
        </p>
        <p>
          لذلك نقارن في Ikhtar.se بين سعر الحملة، السعر بعد الحملة، كمية الإنترنت، فترة الالتزام والشبكة. يمكنك أيضًا قراءة دليلنا عن{' '}
          <InternalTextLink to="/mobilabonnemang/billigaste">أرخص اشتراك جوال في السويد</InternalTextLink>{' '}
          لمعرفة كيف تختار الباقة الأرخص فعلاً على المدى الطويل.
        </p>
      </Section>

      <Section title="مشغّلون يمكنك مقارنة عروضهم">
        <p>
          يمكنك مقارنة عروض من عدة مشغّلين في السويد. إذا وجدت عرضًا مناسبًا، يمكنك الانتقال مباشرة إلى المشغّل لمتابعة الطلب.
        </p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {operatorSlugs.map((slug) => (
            <OperatorOfferCard key={slug} slug={slug} plans={plans} />
          ))}
        </ul>
        <p>
          إذا كنت تريد قراءة المزيد قبل أن تختار، يمكنك أيضًا مقارنة صفحات المشغّلين:{' '}
          {operatorSlugs.map((slug, index) => (
            <span key={slug}>
              <InternalTextLink to={operatorInternalLinks[slug]}>{operatorLabels[slug]}</InternalTextLink>
              {index < operatorSlugs.length - 1 ? '، ' : '.'}
            </span>
          ))}
        </p>
      </Section>

      <Section title="ما الذي يؤثر على سعر اشتراك الجوال؟">
        <p>
          غالبًا ما يكون سبب ظهور باقة بأنها "الأرخص" هو وجود عرض أو حملة لفترة محددة. قد تدفع سعرًا أقل لعدد معين من الأشهر، ثم تنتقل الباقة إلى السعر العادي.
        </p>
        <p>عند مقارنة باقات الجوال في السويد، من الأفضل النظر إلى أمرين معًا:</p>
        <ul className="space-y-2">
          <li className="flex gap-3">
            <span className="mt-1 text-slate-400">•</span>
            <span><strong>سعر الحملة:</strong> ما تدفعه خلال الأشهر الأولى.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 text-slate-400">•</span>
            <span><strong>السعر بعد الحملة:</strong> ما تدفعه بعد انتهاء الخصم.</span>
          </li>
        </ul>
        <p>السعر المنخفض في البداية قد يكون ممتازًا، لكن السعر بعد الحملة هو ما يحدد تكلفة الاشتراك على المدى الطويل.</p>
      </Section>

      <Section title="كيف تختار كمية الإنترنت المناسبة لك؟">
        <p>
          احتياجك للإنترنت يعتمد على مدى استخدامك للهاتف بعيدًا عن الواي فاي، وما إذا كنت تشاهد الفيديوهات أو تستخدم الخرائط والتطبيقات أثناء التنقل.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              title: '5 جيجابايت',
              text: 'مناسب إذا كنت تعتمد غالبًا على الواي فاي، وتستخدم وسائل التواصل بشكل خفيف، وتحتاج إلى الخرائط، الرسائل والتطبيقات اليومية.',
            },
            {
              title: '20 جيجابايت',
              text: 'مناسب إذا كنت تستخدم الهاتف يوميًا، تشاهد محتوى أحيانًا، تستمع إلى الموسيقى أو البودكاست، وتستخدم التطبيقات أثناء التنقل.',
            },
            {
              title: 'إنترنت غير محدود',
              text: 'مناسب إذا كنت تشاهد الكثير من الفيديو، أو تشارك الإنترنت مع الكمبيوتر، أو لا يتوفر لديك واي فاي ثابت في المنزل أو العمل.',
            },
          ].map((card) => (
            <article key={card.title} className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-2 text-2xl font-black text-slate-900">{card.title}</h3>
              <p className="text-sm leading-relaxed text-slate-700">{card.text}</p>
            </article>
          ))}
        </div>
        <p>
          إذا كنت غير متأكد، اقرأ دليلنا:{' '}
          <InternalTextLink to="/guider/hur-mycket-surf">كم إنترنت أحتاج في اشتراك الجوال؟</InternalTextLink>
        </p>
      </Section>

      <Section title="باقات جوال بدون التزام">
        <p>
          الباقات بدون التزام تمنحك مرونة أكبر. إذا وجدت عرضًا أفضل لاحقًا، يمكنك غالبًا تغيير الباقة أو المشغّل بسهولة أكبر.
        </p>
        <p>
          هذا مهم لأن أسعار باقات الجوال والعروض الترويجية تتغير بشكل مستمر. يمكنك قراءة المزيد هنا:{' '}
          <InternalTextLink to="/mobilabonnemang/utan-bindningstid">باقات جوال بدون التزام في السويد</InternalTextLink>
        </p>
      </Section>

      <section className="mb-12 rounded-[16px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-black text-slate-900">أهم الأمور التي يُنصح بمقارنتها قبل اختيار الباقة</h2>
        <BulletList
          items={[
            'السعر بعد انتهاء الحملة',
            'كمية الإنترنت التي تحتاجها شهريًا',
            'فترة الالتزام أو إذا كانت الباقة بدون التزام',
            'الشبكة والتغطية في منطقتك',
            'دعم 5G إذا كان مهمًا لك',
            'eSIM إذا كنت تريد الاستغناء عن شريحة SIM التقليدية',
            'كمية الإنترنت المتاحة داخل الاتحاد الأوروبي والمنطقة الاقتصادية الأوروبية',
          ]}
        />
      </section>

      <Section title="باقات الجوال لفئات مختلفة">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {targetGroups.map((group) => {
            const Icon = group.icon;
            return (
              <article key={group.title} className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-green-100">
                    <Icon className="h-5 w-5 text-green-700" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{group.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{group.description}</p>
              </article>
            );
          })}
        </div>
      </Section>

      <section className="mb-12 rounded-[16px] border border-emerald-200/60 bg-emerald-50 p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-black text-slate-900">عندما تجد الباقة المناسبة</h2>
        <div className="space-y-4 text-base leading-relaxed text-slate-700">
          <p>
            عندما تجد باقة تناسب ميزانيتك واحتياجك من الإنترنت، انقر على "شاهد العرض" للانتقال مباشرة إلى موقع المشغّل. الطلب يتم دائمًا لدى المشغّل نفسه.
          </p>
          <p>يمكنك البدء من القائمة أعلاه أو مشاهدة العروض مباشرة من بعض المشغّلين:</p>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {operatorSlugs.map((slug) => (
              <li key={slug}>
                <OperatorActionLink slug={slug} plans={plans}>
                  شاهد عروض {operatorLabels[slug]}
                </OperatorActionLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-black text-slate-900 md:text-3xl">
          أسئلة شائعة حول باقات الجوال في السويد
        </h2>
        <div className="space-y-3">
          {faqItems.map((faq) => (
            <article key={faq.question} className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-2 text-lg font-black text-slate-900">{faq.question}</h3>
              <p className="leading-relaxed text-slate-700">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[12px] border border-emerald-200/60 bg-emerald-50 p-5">
        <div className="flex gap-3">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
          <div>
            <h2 className="mb-1 text-lg font-black text-emerald-950">حول روابطنا</h2>
            <p className="text-sm leading-relaxed text-emerald-900">
              قد نحصل على عمولة إذا طلبت عبر روابطنا، دون أي تكلفة إضافية عليك. المقارنة مجانية للمستخدم، والأسعار تأتي من مواقع المشغّلين ويتم تحديثها يوميًا.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}
