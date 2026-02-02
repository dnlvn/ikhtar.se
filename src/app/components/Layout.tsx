import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Footer } from '@/app/components/Footer';

export function Layout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Load Cookiebot + Google Analytics only in production (not Figma / localhost / iframe)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isFigmaPreview =
      window.location.hostname.includes('figma.com') ||
      window.location.hostname.includes('localhost') ||
      window.self !== window.top;

    if (isFigmaPreview) return;

    // ---------- Cookiebot ----------
    const cookiebotScript = document.createElement('script');
    cookiebotScript.id = 'Cookiebot';
    cookiebotScript.src = 'https://consent.cookiebot.com/uc.js';
    cookiebotScript.setAttribute(
      'data-cbid',
      '3d7bc1e2-7d49-44a0-9a40-b52bc495fe7e'
    );
    cookiebotScript.setAttribute('data-blockingmode', 'auto');
    cookiebotScript.type = 'text/javascript';
    document.head.appendChild(cookiebotScript);

    // ---------- Google Analytics (controlled by Cookiebot: statistics) ----------
    const gaScript = document.createElement('script');
    gaScript.setAttribute('type', 'text/plain');
    gaScript.setAttribute('data-cookieconsent', 'statistics');
    gaScript.async = true;
    gaScript.src =
      'https://www.googletagmanager.com/gtag/js?id=G-ZPLQ98NLES';
    document.head.appendChild(gaScript);

    const gaInline = document.createElement('script');
    gaInline.setAttribute('type', 'text/plain');
    gaInline.setAttribute('data-cookieconsent', 'statistics');
    gaInline.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-ZPLQ98NLES');
    `;
    document.head.appendChild(gaInline);

    return () => {
      // Cleanup (safe)
      document.getElementById('Cookiebot')?.remove();
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
