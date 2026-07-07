import { Banknote, Clock3, Landmark, Sparkles, WalletCards } from 'lucide-react';
import {
  DELIVERY_METHOD_LABELS_AR,
  formatMoneyTransferNumber,
  type MoneyTransferQuote,
} from '@/lib/moneyTransferData';

interface MoneyTransferOfferCardProps {
  quote: MoneyTransferQuote;
  rank: number;
  fromCountry: string;
  toCountry: string;
  amount: number;
  currency: string;
}

function DeliveryIcon({ method }: { method: MoneyTransferQuote['deliveryMethod'] }) {
  if (method === 'bank_account') return <Landmark className="h-4 w-4" />;
  if (method === 'mobile_wallet') return <WalletCards className="h-4 w-4" />;
  return <Banknote className="h-4 w-4" />;
}

export function MoneyTransferOfferCard({
  quote,
  rank,
  fromCountry,
  toCountry,
  amount,
  currency,
}: MoneyTransferOfferCardProps) {
  const isTopDeal = rank <= 3;
  const isBestDeal = rank === 1;

  const handleClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'money_transfer_cta_click',
      vertical: 'money_transfer',
      provider: quote.provider.name,
      rank,
      from_country: fromCountry,
      to_country: toCountry,
      amount,
      currency,
      recipient_gets: quote.recipientGets,
      fee: quote.fee,
      exchange_rate: quote.exchangeRate,
      delivery_method: quote.deliveryMethod,
    });

    window.open(quote.provider.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative">
      {isTopDeal && (
        <div className={`absolute left-1/2 z-20 -translate-x-1/2 ${isBestDeal ? '-top-4' : '-top-3'}`}>
          <div
            className={`inline-flex items-center justify-center gap-1.5 rounded-full border text-center leading-tight shadow-sm ${
              isBestDeal
                ? 'border-amber-500 bg-gradient-to-r from-amber-100 via-orange-50 to-stone-50 px-5 py-2 text-[13px] font-black text-[#302B27] shadow-[0_10px_28px_rgba(180,83,9,0.22)]'
                : 'border-amber-200 bg-white px-3.5 py-1.5 text-[11px] font-bold text-amber-700'
            }`}
          >
            <Sparkles className={isBestDeal ? 'h-4 w-4 text-amber-600' : 'h-3 w-3 text-amber-500'} />
            {quote.badgeTextAr}
          </div>
        </div>
      )}

      <div
        onClick={handleClick}
        className={`relative overflow-visible rounded-xl border bg-white p-[14px] shadow-sm transition-all duration-200 hover:shadow-lg cursor-pointer ${
          isTopDeal
            ? 'border-amber-300 bg-gradient-to-br from-amber-50/70 via-white to-stone-50/80 shadow-amber-100/50'
            : 'border-stone-200/70'
        }`}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col items-end text-right">
            <div className="mb-1 flex h-[42px] items-center justify-end">
              <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-stone-100 px-2 text-[13px] font-black text-[#302B27] ring-1 ring-stone-200">
                {quote.provider.logoText}
              </div>
            </div>
            <h3 className="text-[20px] font-black leading-tight text-stone-950">
              {quote.provider.name}
            </h3>
          </div>

          <div className="flex flex-col items-end text-right">
            <span className="mb-1 text-[11px] font-bold text-stone-500">المستلم يحصل على</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[34px] font-black leading-none text-stone-950">
                {formatMoneyTransferNumber(quote.recipientGets)}
              </span>
              <span className="text-[13px] font-bold text-stone-700">{quote.recipientCurrency}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-right">
          <div className="rounded-[16px] bg-stone-50 px-3 py-2 ring-1 ring-stone-100">
            <span className="block text-[10px] font-bold text-stone-500">الرسوم</span>
            <span className="text-[14px] font-black text-stone-950">
              {quote.fee} {quote.feeCurrency}
            </span>
          </div>
          <div className="rounded-[16px] bg-stone-50 px-3 py-2 ring-1 ring-stone-100">
            <span className="block text-[10px] font-bold text-stone-500">سعر الصرف</span>
            <span className="text-[14px] font-black text-stone-950">
              {quote.exchangeRate.toFixed(2)}
            </span>
          </div>
          <div className="rounded-[16px] bg-stone-50 px-3 py-2 ring-1 ring-stone-100">
            <span className="block text-[10px] font-bold text-stone-500">المدة</span>
            <span className="inline-flex items-center gap-1 text-[14px] font-black text-stone-950">
              <Clock3 className="h-4 w-4 text-[#302B27]" />
              {quote.transferTimeAr}
            </span>
          </div>
          <div className="rounded-[16px] bg-stone-50 px-3 py-2 ring-1 ring-stone-100">
            <span className="block text-[10px] font-bold text-stone-500">طريقة الاستلام</span>
            <span className="inline-flex items-center gap-1 text-[14px] font-black text-stone-950">
              <DeliveryIcon method={quote.deliveryMethod} />
              {DELIVERY_METHOD_LABELS_AR[quote.deliveryMethod]}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleClick();
          }}
          className={`mt-4 flex min-h-[50px] w-full items-center justify-center rounded-[18px] px-5 text-[16px] font-black text-white transition active:scale-[0.99] ${
            isBestDeal
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_12px_26px_rgba(245,158,11,0.28)]'
              : 'bg-[#302B27] hover:bg-[#1f1b18]'
          }`}
        >
          شاهد العرض
        </button>
      </div>
    </div>
  );
}
