import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, CheckCircle, Info, Search, ShieldCheck } from "lucide-react";
import { Logo } from "@/app/components/Logo";

type SeoFaq = {
  question: string;
  answer: string;
};

type SeoOperatorLink = {
  label: string;
  href: string;
};

type SeoInternalLink = {
  label: string;
  href: string;
};

type SeoLandingPageTemplateProps = {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  h1: string;
  intro: string;
  ctaText: string;
  ctaHref: string;
  disclosure: string;
  bodyIntro: string[];
  sections: Array<{
    title: string;
    paragraphs: string[];
  }>;
  sectionsAfterOperators?: Array<{
    title: string;
    paragraphs: string[];
  }>;
  operatorLinks?: SeoOperatorLink[];
  faq: SeoFaq[];
  internalLinks: SeoInternalLink[];
};

export function SeoLandingPageTemplate({
  metaTitle,
  metaDescription,
  canonicalUrl,
  h1,
  intro,
  ctaText,
  ctaHref,
  disclosure,
  bodyIntro,
  sections,
  sectionsAfterOperators = [],
  operatorLinks = [],
  faq,
  internalLinks,
}: SeoLandingPageTemplateProps) {
  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <main className="bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        <section className="max-w-5xl mx-auto px-4 py-8 sm:py-12 text-center">
          <div className="flex justify-center mb-5">
            <Logo />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-sm font-bold mb-5">
            <Search className="w-4 h-4" />
            دليل مقارنة باقات الجوال
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-4">
            {h1}
          </h1>

          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed mb-6">
            {intro}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              مقارنة مجانية
            </span>
            <span className="w-px h-4 bg-slate-200" />
            <span className="inline-flex items-center gap-2 text-sm text-slate-600">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              روابط إعلانية واضحة
            </span>
          </div>

          <Link
            to={ctaHref}
            className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-green-700 text-white rounded-xl font-black text-lg shadow-lg shadow-green-900/15 hover:bg-green-800 transition-colors"
          >
            <span>{ctaText}</span>
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </Link>

          <div className="mt-6 max-w-3xl mx-auto p-4 bg-amber-50 border border-amber-200/80 rounded-2xl text-right">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed text-amber-900">{disclosure}</p>
            </div>
          </div>
        </section>

        <article className="max-w-4xl mx-auto px-4 pb-16">
          <section className="bg-white border border-slate-200 rounded-[16px] shadow-sm p-5 sm:p-8 mb-8">
            {bodyIntro.map((paragraph) => (
              <p key={paragraph} className="text-slate-700 leading-relaxed text-lg mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </section>

          {sections.map((section) => (
            <section key={section.title} className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-slate-700 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          {operatorLinks.length > 0 && (
            <section className="mb-10 p-5 sm:p-6 bg-white border border-slate-200 rounded-[16px] shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
                مشغلون يمكن مقارنتهم
              </h2>
              <p className="text-slate-700 leading-relaxed text-lg mb-4">
                يمكنك مقارنة عروض من عدة مشغلين في السويد:
              </p>
              <div className="flex flex-wrap gap-2">
                {operatorLinks.map((operator) => (
                  <a
                    key={operator.href}
                    href={operator.href}
                    rel="sponsored nofollow"
                    className="inline-flex items-center px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-800 font-bold hover:border-green-300 hover:bg-green-50 transition-colors"
                  >
                    {operator.label}
                  </a>
                ))}
              </div>
            </section>
          )}

          {sectionsAfterOperators.map((section) => (
            <section key={section.title} className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-slate-700 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <section className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-5">
              أسئلة شائعة
            </h2>
            <div className="space-y-3">
              {faq.map((item) => (
                <details
                  key={item.question}
                  className="group bg-white border border-slate-200 rounded-[14px] shadow-sm p-5"
                >
                  <summary className="cursor-pointer list-none font-black text-slate-900 text-lg">
                    {item.question}
                  </summary>
                  <p className="text-slate-700 leading-relaxed mt-3">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {internalLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="p-4 bg-white border border-slate-200 rounded-[14px] shadow-sm hover:border-green-300 hover:shadow-md transition-all font-bold text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </section>

          <section className="text-center p-7 sm:p-9 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-[16px] border border-green-200/70 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              جاهز لمقارنة العروض؟
            </h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              انتقل إلى مقارنة باقات الجوال وشاهد العروض الحالية في مكان واحد.
            </p>
            <Link
              to={ctaHref}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-green-700 text-white rounded-xl font-black shadow-lg shadow-green-900/15 hover:bg-green-800 transition-colors"
            >
              {ctaText}
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          </section>
        </article>
      </main>
    </>
  );
}
