import { Link } from 'react-router';
import { t, tr } from '@/i18n';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-3xl mx-auto">
          {/* Company info */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-3">{t('footer.siteName')}</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              {t('footer.siteDescription')}
            </p>
            <div className="text-sm text-slate-400">
              <p>{t('footer.company.name')}</p>
              <p>{t('footer.company.orgNumber')}</p>
              <p>{t('footer.company.address')}</p>
            </div>
          </div>

          {/* Links */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-3">{t('footer.links.title')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/integritetspolicy" 
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {t('footer.links.privacy')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/cookies" 
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {t('footer.links.cookies')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclosures */}
        <div className="border-t border-slate-800 pt-6 space-y-3 text-center">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">{t('footer.disclosures.affiliateTitle')}</strong> {t('footer.disclosures.affiliateText')}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">{t('footer.disclosures.transparencyTitle')}</strong> {t('footer.disclosures.transparencyText')}
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 mt-6 pt-6">
          <p className="text-xs text-slate-500 text-center">
            {tr('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}