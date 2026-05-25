const dataUsageCards = [
  {
    title: 'استخدام خفيف',
    amount: '5–10 GB',
    description: 'مناسب للتصفح والرسائل واستخدام التطبيقات اليومية الخفيفة.',
  },
  {
    title: 'استخدام يومي',
    amount: '20–50 GB',
    description: 'مناسب للسوشيال ميديا والموسيقى والخرائط والاستخدام خارج WiFi.',
  },
  {
    title: 'استخدام كثير',
    amount: 'أكثر من 50 GB',
    description: 'مناسب للفيديو والاستخدام المتكرر ومشاركة الإنترنت أحياناً.',
  },
  {
    title: 'استخدام غير محدود',
    amount: 'إنترنت غير محدود',
    description: 'مناسب لمن لا يريد التفكير في الاستهلاك أو يستخدم الهاتف كثيراً.',
  },
];

export function MobileDataUsageGuide() {
  return (
    <section className="mx-auto mt-10 max-w-4xl px-[12px]" dir="rtl">
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4 shadow-sm">
        <h2 className="mb-2 text-2xl font-black text-slate-900">كم تحتاج من الإنترنت؟</h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          اختر كمية surf قريبة من استخدامك اليومي. إذا كنت غير متأكد، ابدأ من الباقات المتوسطة وقارن السعر بعد العرض.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {dataUsageCards.map((card) => (
            <article key={card.title} className="rounded-xl border border-white bg-white p-4 shadow-sm">
              <div className="mb-1 text-sm font-black text-green-700">{card.title}</div>
              <div className="mb-2 text-xl font-black text-slate-950">{card.amount}</div>
              <p className="text-sm leading-relaxed text-slate-600">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
