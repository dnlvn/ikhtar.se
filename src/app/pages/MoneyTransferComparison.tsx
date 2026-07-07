import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeftRight, Check, RefreshCw, ShieldCheck } from 'lucide-react';
import { MoneyTransferSearch } from '@/app/components/MoneyTransferSearch';
import { MoneyTransferOfferCard } from '@/app/components/MoneyTransferOfferCard';
import {
  getCurrencyForSendCountry,
  getDefaultSendCountryCode,
  getMoneyTransferQuotes,
  getReceiveCountry,
  getSendCountry,
} from '@/lib/moneyTransferData';

const MONEY_TRANSFER_PRIMARY = '#302B27';

export function MoneyTransferComparison() {
  const [fromCountry, setFromCountry] = useState('se');
  const [toCountry, setToCountry] = useState('sy');
  const [amount, setAmount] = useState('1000');
  const [currency, setCurrency] = useState('SEK');
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  const numericAmount = Math.max(1, Number(amount || '0'));
  const sendCountry = getSendCountry(fromCountry);
  const receiveCountry = getReceiveCountry(toCountry);

  const quotes = useMemo(
    () => getMoneyTransferQuotes({ amount: numericAmount, currency, toCountryCode: toCountry }),
    [currency, numericAmount, toCountry]
  );

  useEffect(() => {
    const detectedCountry = getDefaultSendCountryCode(
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.language
    );
    setFromCountry(detectedCountry);
    setCurrency(getCurrencyForSendCountry(detectedCountry));
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => {
      setHasSearched(true);
      setLoading(false);
    }, 650);

    return () => window.clearTimeout(timer);
  }, [fromCountry, toCountry, amount, currency]);

  const handleFromCountryChange = (value: string) => {
    setFromCountry(value);
    setCurrency(getCurrencyForSendCountry(value));
  };

  const handleSearch = () => {
    setLoading(true);
    window.setTimeout(() => {
      setHasSearched(true);
      setLoading(false);
      document.getElementById('money-transfer-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 650);
  };

  return (
    <>
      <Helmet>
        <title>قارن تحويل الأموال دولياً | Ikhtar</title>
        <meta
          name="description"
          content="قارن رسوم وأسعار تحويل الأموال دولياً واعثر على طريقة مناسبة لإرسال المال خلال دقائق."
        />
        <link rel="canonical" href="https://ikhtar.se/money-transfer" />
      </Helmet>

      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50 text-stone-950">
        <section className="relative overflow-hidden bg-gradient-to-br from-stone-50 via-white to-amber-50/50 px-4 pb-5 pt-7 sm:pb-8 sm:pt-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-5 flex justify-center">
              <div className="flex items-center gap-2.5" dir="ltr">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-stone-100 text-[#302B27] ring-1 ring-stone-200 shadow-sm">
                  <ArrowLeftRight className="h-8 w-8" strokeWidth={2.5} />
                </div>
                <div className="flex items-baseline leading-none">
                  <span className="text-[36px] font-bold tracking-tight text-slate-900">ikhtar</span>
                  <span className="text-[20px] font-medium tracking-wide text-black">.se</span>
                </div>
              </div>
            </div>

            <div className="mx-auto mb-5 max-w-3xl text-center">
              <h1 className="mb-3 text-4xl font-black leading-tight text-stone-950 sm:text-5xl lg:text-6xl">
                قارن أسعار{' '}
                <span className="bg-gradient-to-r from-[#302B27] via-stone-700 to-amber-700 bg-clip-text text-transparent">
                  تحويل الأموال
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-[16px] font-semibold leading-8 text-stone-600 sm:text-xl">
                اعثر على أرخص طريقة لإرسال المال دولياً خلال دقائق.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-stone-600">
                <div className="inline-flex items-center gap-1.5">
                  <RefreshCw className="h-4 w-4 text-[#302B27]" />
                  <span className="text-[12px] font-bold">تحديث منتظم للأسعار والرسوم</span>
                </div>
                <div className="h-4 w-px bg-stone-200" />
                <div className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#302B27]" />
                  <span className="text-[12px] font-bold">نقارن مزودي تحويل الأموال</span>
                </div>
              </div>
            </div>

            <MoneyTransferSearch
              fromCountry={fromCountry}
              toCountry={toCountry}
              amount={amount}
              currency={currency}
              loading={loading}
              onFromCountryChange={handleFromCountryChange}
              onToCountryChange={setToCountry}
              onAmountChange={setAmount}
              onCurrencyChange={setCurrency}
              onSearch={handleSearch}
            />
          </div>
        </section>

        <main className="mx-auto max-w-4xl px-4 py-5">
          <div className="mb-4 rounded-[22px] bg-white px-4 py-4 text-center shadow-sm ring-1 ring-stone-200/70">
            <div className="mb-1 flex items-center justify-center gap-1.5 text-[13px] font-black text-[#302B27]">
              <Check className="h-4 w-4" />
              مقارنة تجريبية للرسوم والأسعار
            </div>
            <p className="text-[13px] leading-6 text-stone-500">
              من {sendCountry.flag} {sendCountry.nameAr} إلى {receiveCountry.flag} {receiveCountry.nameAr}، بقيمة {numericAmount} {currency}
            </p>
          </div>

          <div className="mb-5 text-center">
            <p className="text-[10px] leading-5 text-stone-500">
              إعلان – قد نحصل على عمولة إذا نقرت على رابط وانتقلت إلى أحد مزودي الخدمة، دون أي تكلفة إضافية عليك. الأسعار والرسوم قد تتغير ويجب التحقق منها لدى المزود قبل الإرسال.
            </p>
          </div>

          <section id="money-transfer-results" className="scroll-mt-4">
            {loading && (
              <div className="grid grid-cols-1 gap-3">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="h-[214px] animate-pulse rounded-xl border border-stone-200 bg-white shadow-sm">
                    <div className="h-full rounded-xl bg-gradient-to-r from-stone-100 via-white to-stone-100" />
                  </div>
                ))}
              </div>
            )}

            {!loading && hasSearched && (
              <div className="grid grid-cols-1 gap-4">
                {quotes.map((quote, index) => (
                  <MoneyTransferOfferCard
                    key={quote.id}
                    quote={quote}
                    rank={index + 1}
                    fromCountry={fromCountry}
                    toCountry={toCountry}
                    amount={numericAmount}
                    currency={currency}
                  />
                ))}
              </div>
            )}
          </section>

          <div className="mt-6 rounded-[24px] bg-[#302B27] p-5 text-center text-white shadow-[0_18px_42px_rgba(48,43,39,0.22)]">
            <h2 className="mb-2 text-xl font-black">حوّل المال بثقة</h2>
            <p className="text-[13px] leading-7 text-stone-200">
              نقارن الرسوم وسعر الصرف ووقت التحويل حتى تختار العرض الأنسب بسرعة.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
