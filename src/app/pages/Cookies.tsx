import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { t } from '@/i18n';

export function Cookies() {
  const handleChangeCookieSettings = () => {
    // This will trigger the Cookiebot dialog if it's loaded
    if (typeof window !== 'undefined' && (window as any).Cookiebot) {
      (window as any).Cookiebot.renew();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('cookies.backToHome')}
        </Link>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
          {t('cookies.title')}
        </h1>
        
        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              {t('cookies.whatAreCookies.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {t('cookies.whatAreCookies.text')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              {t('cookies.howWeUseCookies.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('cookies.howWeUseCookies.text')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              {t('cookies.typesOfCookies.title')}
            </h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {t('cookies.typesOfCookies.necessary.title')}
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {t('cookies.typesOfCookies.necessary.text')}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {t('cookies.typesOfCookies.statistics.title')}
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {t('cookies.typesOfCookies.statistics.text')}
                </p>
                <p className="text-slate-600 text-sm mt-2">
                  <strong>{t('cookies.typesOfCookies.statistics.example')}</strong>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {t('cookies.typesOfCookies.marketing.title')}
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {t('cookies.typesOfCookies.marketing.text')}
                </p>
                <p className="text-slate-600 text-sm mt-2">
                  <strong>{t('cookies.typesOfCookies.marketing.example')}</strong>
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              {t('cookies.manageCookies.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {t('cookies.manageCookies.text')}
            </p>
            <button
              onClick={handleChangeCookieSettings}
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              {t('cookies.manageCookies.button')}
            </button>
            <p className="text-slate-600 text-sm mt-4">
              {t('cookies.manageCookies.note')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              {t('cookies.moreInfo.title')}
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {t('cookies.moreInfo.text1')}{' '}
              <a href="/integritetspolicy" className="text-green-600 hover:text-green-700 underline font-medium">
                {t('cookies.moreInfo.privacyPolicyLink')}
              </a>.
            </p>
            <p className="text-slate-700 leading-relaxed mt-3">
              {t('cookies.moreInfo.text2')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}