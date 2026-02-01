import { useState } from 'react';
import { 
  CheckCircle, 
  RefreshCw, 
  Tag, 
  Smartphone, 
  Users, 
  GraduationCap, 
  User, 
  Baby, 
  Home, 
  Briefcase,
  ChevronDown,
  Info,
  ArrowUp
} from 'lucide-react';
import { t } from '@/i18n';

export function SeoContentSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const scrollToResults = () => {
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // FAQ questions and answers from the dictionary
  const faqsData = t('seo.faq.questions');
  const faqs = Array.isArray(faqsData) ? faqsData : [];

  const targetGroups = [
    {
      icon: GraduationCap,
      title: t('seo.targetGroups.student.title'),
      description: t('seo.targetGroups.student.description')
    },
    {
      icon: User,
      title: t('seo.targetGroups.senior.title'),
      description: t('seo.targetGroups.senior.description')
    },
    {
      icon: Baby,
      title: t('seo.targetGroups.youth.title'),
      description: t('seo.targetGroups.youth.description')
    },
    {
      icon: Home,
      title: t('seo.targetGroups.family.title'),
      description: t('seo.targetGroups.family.description')
    },
    {
      icon: Briefcase,
      title: t('seo.targetGroups.business.title'),
      description: t('seo.targetGroups.business.description')
    }
  ];

  return (
    <section className="max-w-4xl mx-auto px-[16px] py-[24px] mt-12">
      {/* Main SEO Intro */}
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
          {t('seo.mainTitle')}
        </h2>
        <p className="text-lg text-slate-700 leading-relaxed mb-6">
          {t('seo.mainIntro1')}
        </p>
        <p className="text-base text-slate-600 leading-relaxed">
          {t('seo.mainIntro2')}
        </p>
      </div>

      {/* Trust Chips Row */}
      <div className="flex flex-wrap gap-3 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[12px] overflow-hidden bg-emerald-50 border border-emerald-200/60">
          <RefreshCw className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-700">{t('seo.trustChips.updatedDaily')}</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[12px] overflow-hidden bg-green-50 border border-green-200/60">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">{t('seo.trustChips.freeToUse')}</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[12px] overflow-hidden bg-teal-50 border border-teal-200/60">
          <Tag className="w-4 h-4 text-teal-600" />
          <span className="text-sm font-semibold text-teal-700">{t('seo.trustChips.samePriceAsOperator')}</span>
        </div>
      </div>

      {/* Så funkar tjänsten */}
      <div className="mb-12 p-6 bg-white rounded-[16px] overflow-hidden border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('seo.howItWorks.title')}</h3>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold">1</span>
            <span className="text-slate-700 leading-relaxed pt-0.5">{t('seo.howItWorks.step1')}</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold">2</span>
            <span className="text-slate-700 leading-relaxed pt-0.5">{t('seo.howItWorks.step2')}</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold">3</span>
            <span className="text-slate-700 leading-relaxed pt-0.5">{t('seo.howItWorks.step3')}</span>
          </li>
        </ol>
      </div>

      {/* Vad påverkar priset */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('seo.priceFactors.title')}</h3>
        <p className="text-slate-700 leading-relaxed mb-4">
          {t('seo.priceFactors.intro')}
        </p>
        <p className="text-slate-700 leading-relaxed mb-3">
          {t('seo.priceFactors.compareTitle')}
        </p>
        <ul className="space-y-2 mb-4">
          <li className="flex gap-3">
            <span className="text-slate-400 mt-1">•</span>
            <span className="text-slate-700 leading-relaxed"><strong>{t('seo.priceFactors.campaignPrice')}</strong> {t('seo.priceFactors.campaignPriceDesc')}</span>
          </li>
          <li className="flex gap-3">
            <span className="text-slate-400 mt-1">•</span>
            <span className="text-slate-700 leading-relaxed"><strong>{t('seo.priceFactors.regularPrice')}</strong> {t('seo.priceFactors.regularPriceDesc')}</span>
          </li>
        </ul>
        <p className="text-slate-600 leading-relaxed">
          {t('seo.priceFactors.conclusion')}
        </p>
      </div>

      {/* Hur väljer man rätt surfmängd */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('seo.dataAmount.title')}</h3>
        <p className="text-slate-700 leading-relaxed mb-6">
          {t('seo.dataAmount.intro')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-5 bg-white rounded-[12px] overflow-hidden border border-slate-200 shadow-sm">
            <div className="text-3xl font-black text-slate-900 mb-2">{t('seo.dataAmount.option5gb')}</div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {t('seo.dataAmount.option5gbDesc')}
            </p>
          </div>
          
          <div className="p-5 bg-white rounded-[12px] overflow-hidden border border-slate-200 shadow-sm">
            <div className="text-3xl font-black text-slate-900 mb-2">{t('seo.dataAmount.option20gb')}</div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {t('seo.dataAmount.option20gbDesc')}
            </p>
          </div>
          
          <div className="p-5 bg-white rounded-[12px] overflow-hidden border border-slate-200 shadow-sm">
            <div className="text-3xl font-black text-slate-900 mb-2">{t('seo.dataAmount.optionUnlimited')}</div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {t('seo.dataAmount.optionUnlimitedDesc')}
            </p>
          </div>
        </div>

        <p className="text-slate-600 leading-relaxed">
          {t('seo.dataAmount.conclusion')}
        </p>
      </div>

      {/* Viktiga saker att jämföra */}
      <div className="mb-12 p-6 bg-white rounded-[16px] overflow-hidden border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('seo.importantComparison.title')}</h3>
        <ul className="space-y-2">
          <li className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700 leading-relaxed">{t('seo.importantComparison.priceAfterCampaign')}</span>
          </li>
          <li className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700 leading-relaxed">{t('seo.importantComparison.binding')}</span>
          </li>
          <li className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700 leading-relaxed">{t('seo.importantComparison.network')}</span>
          </li>
          <li className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700 leading-relaxed">{t('seo.importantComparison.esim')}</span>
          </li>
          <li className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700 leading-relaxed">{t('seo.importantComparison.euRoaming')}</span>
          </li>
        </ul>
      </div>

      {/* Mobilabonnemang för olika målgrupper */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('seo.targetGroups.title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {targetGroups.map((group, index) => {
            const Icon = group.icon;
            return (
              <div key={index} className="p-5 bg-white rounded-[12px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-green-700" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{group.title}</h4>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {group.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('seo.faq.title')}</h3>
        <div className="space-y-3">
          {faqs.map((faq: any, index: number) => (
            <div key={index} className="bg-white rounded-[12px] overflow-hidden border border-slate-200 shadow-sm">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-900">{faq.q}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform ${
                    openFaqIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaqIndex === index && (
                <div className="px-6 pb-4 pt-1">
                  <p className="text-slate-700 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Affiliate Disclosure */}
      <div className="mb-12 p-5 bg-emerald-50 border border-emerald-200/60 rounded-[12px] overflow-hidden flex gap-3">
        <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-emerald-900 mb-1">{t('seo.affiliateDisclosure.title')}</h4>
          <p className="text-sm text-emerald-800 leading-relaxed">
            {t('seo.affiliateDisclosure.text')}
          </p>
        </div>
      </div>

      {/* Closing CTA */}
      <div className="text-center p-8 bg-gradient-to-br from-emerald-50 via-green-50/50 to-teal-50/50 rounded-[16px] overflow-hidden border border-green-200/60 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-3">{t('seo.closingCta.title')}</h3>
        <p className="text-slate-700 leading-relaxed mb-6 max-w-2xl mx-auto">
          {t('seo.closingCta.description')}
        </p>
        <button
          onClick={scrollToResults}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-green-600 text-green-700 rounded-xl font-bold hover:bg-green-50 hover:border-green-700 transition-all shadow-sm hover:shadow-md"
        >
          <ArrowUp className="w-5 h-5" />
          {t('seo.closingCta.button')}
        </button>
      </div>
    </section>
  );
}