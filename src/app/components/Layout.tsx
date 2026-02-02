import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Footer } from '@/app/components/Footer';

export function Layout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Load Cookiebot + GTM only in production (not Figma / localhost / iframe)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isFigmaPreview =
      window.location.hostname.includes('figma.com') ||
      window.location.hostname.includes('localhost') ||
      window.self !== window.top;

    if (isFigmaPreview) return;

    // ---------- Cookiebot ----------
    if (!document.getElementById('Cookiebot')) {
      const cookiebotScript = document.createElement('script');
      cookiebotScript.id = 'Cookiebot';
      cookiebotScript.src = 'https://consent.cookiebot.com/uc.js';
      cookiebotScript.setAttribute('data-cbid', '3d7bc1e2-7d49-44a0-9a40-b52bc495fe7e');
      cookiebotScript.setAttribute('data-blockingmode', 'auto');
      cookiebotScript.type = 'text/javascript';
      document.head.appendChild(cookiebotScript);
    }

    // ---------- Google Tag Manager (controlled by Cookiebot: marketing) ----------
    if (!document.getElementById('GTM')) {
      const gtmScript = document.createElement('script');
      gtmScript.id = 'GTM';
      gtmScript.setAttribute('type', 'text/plain');
      gtmScript.setAttribute('data-cookieconsent', 'marketing');
      gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-NT9C9PNP');
      `;
      document.head.appendChild(gtmScript);
    }

    return () => {
      // Cleanup: leave Cookiebot/GTM in place between route changes (do nothing)
    };
  }, []);

  // Don't show footer on landing page (it has its own)
  const showFooter = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      <Outlet />
      {showFooter && <Footer />}
    </div>
  );
}
