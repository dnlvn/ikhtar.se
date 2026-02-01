import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Footer } from '@/app/components/Footer';

export function Layout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Load Cookiebot only in production (not in Figma preview)
  useEffect(() => {
    // Check if we're NOT in Figma environment
    const isFigmaPreview = window.location.hostname.includes('figma.com') || 
                           window.location.hostname.includes('localhost') ||
                           window.self !== window.top; // Check if in iframe
    
    if (!isFigmaPreview) {
      // Only load in production
      const script = document.createElement('script');
      script.id = 'Cookiebot';
      script.src = 'https://consent.cookiebot.com/uc.js';
      script.setAttribute('data-cbid', '3d7bc1e2-7d49-44a0-9a40-b52bc495fe7e');
      script.setAttribute('data-blockingmode', 'auto');
      script.type = 'text/javascript';
      document.head.appendChild(script);

      return () => {
        // Cleanup on unmount
        const existingScript = document.getElementById('Cookiebot');
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
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