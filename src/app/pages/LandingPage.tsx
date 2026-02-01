import { Link } from "react-router";
import { Logo } from "@/app/components/Logo";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";

export function LandingPage() {
  return (
    <>
      <Helmet>
        <title>إختيار – قارن واعثر على أفضل العروض</title>
        <meta 
          name="description" 
          content="نبني مقارنات بسيطة تساعدك على العثور على الخيار الأرخص بسرعة." 
        />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <Logo />
          </div>

          {/* Hero Content */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              إختيار – قارن واعثر على أفضل العروض
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8">
              نبني مقارنات بسيطة تساعدك على العثور على الخيار الأرخص بسرعة.
            </p>
          </div>
        </div>
      </div>

      {/* Category Cards Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mobile Plans Card - Active */}
          <Link
            to="/mobilabonnemang"
            className="group block p-8 bg-white border-2 border-green-700 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-green-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                متاح الآن
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              باقات الجوال
            </h2>
            <p className="text-slate-600 mb-6">
              قارن باقات الجوال واعثر على أرخص سعر متاح الآن.
            </p>

            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg font-bold group-hover:bg-green-800 transition-colors">
              <span>اذهب إلى المقارنة</span>
              <ArrowLeft className="w-5 h-5 transform rotate-180" />
            </div>
          </Link>

          {/* Placeholder Cards - Coming Soon */}
          {[
            {
              title: "قروض",
              description: "قارن القروض من مختلف البنوك.",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ),
            },
            {
              title: "الكهرباء",
              description: "قارن أسعار الكهرباء من مختلف الموردين.",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              ),
            },
          ].map((card, index) => (
            <div
              key={index}
              className="relative p-8 bg-slate-50 border-2 border-slate-200 rounded-2xl opacity-60"
            >
              <div className="absolute top-4 left-4 px-3 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-full">
                قريبًا
              </div>

              <div className="p-3 bg-slate-200 rounded-lg inline-block mb-4 mt-8">
                <svg
                  className="w-8 h-8 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {card.icon}
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-slate-700 mb-3">
                {card.title}
              </h2>
              <p className="text-slate-500">{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-600">
              © 2026 إختيار. جميع الحقوق محفوظة.
            </div>
            <div className="flex gap-6">
              <Link
                to="/integritetspolicy"
                className="text-sm text-slate-600 hover:text-green-700 transition-colors"
              >
                سياسة الخصوصية
              </Link>
              <Link
                to="/cookies"
                className="text-sm text-slate-600 hover:text-green-700 transition-colors"
              >
                ملفات تعريف الارتباط
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
