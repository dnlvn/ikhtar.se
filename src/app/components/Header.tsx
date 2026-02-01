import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
                MobilJämför
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
              Abonnemang
            </a>
            <a href="#" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
              Mobiler
            </a>
            <a href="#" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
              Bredband
            </a>
            <a href="#" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
              Om oss
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200">
          <div className="px-4 py-4 space-y-2 bg-white">
            <a
              href="#"
              className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Abonnemang
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Mobiler
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Bredband
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Om oss
            </a>
          </div>
        </div>
      )}
    </header>
  );
}