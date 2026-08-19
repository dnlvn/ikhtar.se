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
                ? 'border-[#F2B84B] bg-gradient-to-r from-[#F2B84B]/35 via-white to-rose-50 px-5 py-2 text-[13px] font-black text-[#710627] shadow-[0_10px_28px_rgba(113,6,39,0.18)]'
                : 'border-[#F2B84B]/60 bg-white px-3.5 py-1.5 text-[11px] font-bold text-[#710627]'
            }`}
          >
            <Sparkles className={isBestDeal ? 'h-4 w-4 text-[#F2B84B]' : 'h-3 w-3 text-[#F2B84B]'} />
            {quote.badgeTextAr}
          </div>
        </div>
      )}

      <div
        onClick={handleClick}
        className={`relative overflow-visible rounded-xl border bg-white p-[14px] shadow-sm transition-all duration-200 hover:shadow-lg cursor-pointer ${
          isTopDeal
            ? 'border-[#F2B84B] bg-gradient-to-br from-rose-50/60 via-white to-amber-50/50 shadow-rose-100/50'
            : 'border-stone-200/70'
        }`}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col items-end text-right">
            <div className="mb-1 flex h-[42px] items-center justify-end">
              <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-rose-50 px-2 text-[13px] font-black text-[#710627] ring-1 ring-rose-100">
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
              <Clock3 className="h-4 w-4 text-[#710627]" />
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
          className={`
            mt-4 min-h-[46px] min-w-[140px] whitespace-nowrap px-4 py-2.5 rounded-xl font-bold uppercase sm:px-5
            transition-all duration-500 shadow-sm hover:shadow-md hover:-translate-y-0.5
            cursor-pointer relative overflow-hidden
            ${isTopDeal
              ? rank === 1
                ? 'text-[14px] sm:text-[15px] text-white shadow-xl ring-2 ring-amber-300/50 hover:brightness-110'
                : 'text-[12px] sm:text-[13px] text-white shadow-lg hover:brightness-110'
              : 'w-full text-[12px] sm:text-[13px] bg-[#710627] text-white border-2 border-[#710627] hover:bg-[#52041d]'
            }
          `}
          style={isTopDeal ? {
            backgroundImage: rank === 1
              ? 'linear-gradient(to right, #f97316 0%, #facc15 48%, #f97316 100%)'
              : 'linear-gradient(to right, #F7971E 0%, #FFD200 51%, #F7971E 100%)',
            backgroundSize: rank === 1 ? '200% auto' : undefined,
            animation: rank === 1 ? 'shimmer-slide 3s ease-in-out infinite' : undefined,
            borderRadius: '0.75rem',
          } : {
            borderRadius: '0.75rem',
          }}
        >
          شاهد العرض
        </button>
      </div>
    </div>
  );
}
