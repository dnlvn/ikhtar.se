import { Database, Key, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function SupabaseSetupGuide() {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const envExample = `VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`;

  const copyToClipboard = (text: string, type: 'url' | 'key') => {
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl border-2 border-green-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mb-4 shadow-lg">
            <Database className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            🚀 Supabase Setup Required
          </h1>
          <p className="text-gray-600">
            Let's connect your app to Supabase in just a few steps
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-8">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white font-bold flex items-center justify-center">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Create a Supabase Project
              </h3>
              <p className="text-gray-600 mb-3">
                If you don't have one already, create a free Supabase project
              </p>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md"
              >
                <ExternalLink className="h-4 w-4" />
                Go to Supabase Dashboard
              </a>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white font-bold flex items-center justify-center">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Get Your API Credentials
              </h3>
              <p className="text-gray-600 mb-3">
                In your Supabase project: <span className="font-semibold">Settings → API</span>
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">You'll need:</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 ml-6">
                  <li>• Project URL</li>
                  <li>• anon/public API key</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white font-bold flex items-center justify-center">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Create Database Table
              </h3>
              <p className="text-gray-600 mb-3">
                Run this SQL in your Supabase SQL Editor:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-green-400 font-mono">
{`-- Table already exists! Just verify it:
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'mobile_plans_public';

-- If empty, add sample data:
-- See /ADD_SAMPLE_DATA_CORRECT.sql`}
                </pre>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ✅ Table exists! See <code className="bg-gray-100 px-1 rounded">/ADD_SAMPLE_DATA_CORRECT.sql</code> for sample data
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white font-bold flex items-center justify-center">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Update Your .env File
              </h3>
              <p className="text-gray-600 mb-3">
                In the root of your project, update <code className="bg-gray-100 px-1 rounded">.env</code>:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 relative">
                <pre className="text-sm text-green-400 font-mono">
{envExample}
                </pre>
                <button
                  onClick={() => copyToClipboard(envExample, 'url')}
                  className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition-all"
                >
                  {copiedUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white font-bold flex items-center justify-center">
              5
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Restart Development Server
              </h3>
              <p className="text-gray-600 mb-3">
                Stop and restart your dev server to load the new environment variables
              </p>
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-sm text-green-400 font-mono">
{`npm run dev`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="text-2xl">💡</div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 mb-1">Need Help?</h4>
                <p className="text-sm text-blue-800">
                  Check out the detailed guides:
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• <code className="bg-blue-100 px-1 rounded">/SUPABASE_INTEGRATION.md</code> - Complete setup guide</li>
                  <li>• <code className="bg-blue-100 px-1 rounded">/DATABASE_QUERIES.md</code> - SQL reference & samples</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}