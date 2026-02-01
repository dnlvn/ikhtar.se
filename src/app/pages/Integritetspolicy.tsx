import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { t } from '@/i18n';

export function Integritetspolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('privacy.backToHome')}
        </Link>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
          {t('privacy.title')}
        </h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-8">
            {t('privacy.lastUpdated')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              {t('privacy.section1.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              {t('privacy.section1.intro')}
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-700">
              <p className="mb-1"><strong>{t('privacy.section1.company')}</strong></p>
              <p className="mb-1">{t('privacy.section1.orgNumber')}</p>
              <p className="mb-1">{t('privacy.section1.address')}</p>
              <p>{t('privacy.section1.email')}</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              {t('privacy.section2.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              {t('privacy.section2.intro')}
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              {(t('privacy.section2.items') as any[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              {t('privacy.section3.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              {t('privacy.section3.intro')}
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              {(t('privacy.section3.items') as any[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              {t('privacy.section4.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              {t('privacy.section4.intro')}
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-3">
              <li>
                <strong>{t('privacy.section4.consent')}</strong>
                <p className="mt-1">{t('privacy.section4.consentText')}</p>
              </li>
              <li>
                <strong>{t('privacy.section4.legitimateInterest')}</strong>
                <p className="mt-1">{t('privacy.section4.legitimateInterestText')}</p>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}