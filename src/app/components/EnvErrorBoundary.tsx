import { AlertCircle, ExternalLink } from 'lucide-react';

export function EnvErrorBoundary() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-red-300 p-8 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-4">
            Konfigurationsfel
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-700 text-center mb-8">
            Supabase-miljövariabler saknas. Appen kan inte ansluta till databasen.
          </p>

          {/* Error Box */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
            <h2 className="text-sm font-bold text-red-900 mb-3 uppercase tracking-wide">
              Saknade miljövariabler:
            </h2>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <code className="text-red-800">VITE_SUPABASE_URL</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <code className="text-red-800">VITE_SUPABASE_ANON_KEY</code>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              🔧 Så här fixar du det:
            </h2>
            <ol className="space-y-3 text-sm text-blue-900">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <span>
                  Skapa en <code className="px-2 py-0.5 bg-blue-100 rounded font-mono text-xs">.env</code> fil i projektets rotmapp
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span>
                  Lägg till dina Supabase-uppgifter:
                </span>
              </li>
            </ol>
            
            <div className="mt-4 bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto">
              <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
              <div>VITE_SUPABASE_ANON_KEY=your-anon-key-here</div>
            </div>

            <ol className="space-y-3 text-sm text-blue-900 mt-4" start={3}>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <span>
                  Starta om utvecklingsservern
                </span>
              </li>
            </ol>
          </div>

          {/* Help Link */}
          <div className="text-center">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
            >
              Öppna Supabase Dashboard
              <ExternalLink className="h-4 w-4" />
            </a>
            <p className="text-xs text-gray-500 mt-3">
              Hämta dina API-nycklar under <strong>Settings → API</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
