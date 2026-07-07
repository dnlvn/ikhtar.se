import { ArrowLeft, Banknote, Globe2, Search, Send } from 'lucide-react';
import {
  MONEY_TRANSFER_CURRENCIES,
  RECEIVE_COUNTRIES,
  SEND_COUNTRIES,
} from '@/lib/moneyTransferData';

interface MoneyTransferSearchProps {
  fromCountry: string;
  toCountry: string;
  amount: string;
  currency: string;
  loading: boolean;
  onFromCountryChange: (value: string) => void;
  onToCountryChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  onSearch: () => void;
}

export function MoneyTransferSearch({
  fromCountry,
  toCountry,
  amount,
  currency,
  loading,
  onFromCountryChange,
  onToCountryChange,
  onAmountChange,
  onCurrencyChange,
  onSearch,
}: MoneyTransferSearchProps) {
  return (
    <div className="rounded-[26px] border border-white/80 bg-white/95 p-3.5 shadow-[0_18px_54px_rgba(48,43,39,0.12)] ring-1 ring-stone-200/70 sm:p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-[15px] font-black text-stone-950">
            <Send className="h-4 w-4 text-[#302B27]" />
            من
          </span>
          <div className="flex min-h-[54px] items-center gap-2 rounded-[18px] border border-stone-200 bg-stone-50/80 px-3 transition focus-within:border-[#302B27] focus-within:bg-white focus-within:ring-4 focus-within:ring-stone-100">
            <Globe2 className="h-5 w-5 flex-shrink-0 text-stone-500" />
            <select
              dir="rtl"
              value={fromCountry}
              onChange={(event) => onFromCountryChange(event.target.value)}
              className="h-full w-full bg-transparent text-[15px] font-extrabold text-stone-950 outline-none"
            >
              {SEND_COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.nameAr}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-[15px] font-black text-stone-950">
            <ArrowLeft className="h-4 w-4 text-[#302B27]" />
            إلى
          </span>
          <div className="flex min-h-[54px] items-center gap-2 rounded-[18px] border border-stone-200 bg-stone-50/80 px-3 transition focus-within:border-[#302B27] focus-within:bg-white focus-within:ring-4 focus-within:ring-stone-100">
            <Globe2 className="h-5 w-5 flex-shrink-0 text-stone-500" />
            <select
              dir="rtl"
              value={toCountry}
              onChange={(event) => onToCountryChange(event.target.value)}
              className="h-full w-full bg-transparent text-[15px] font-extrabold text-stone-950 outline-none"
            >
              {RECEIVE_COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.nameAr}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 flex items-center gap-1.5 text-[15px] font-black text-stone-950">
            <Banknote className="h-4 w-4 text-[#302B27]" />
            المبلغ
          </span>
          <div className="grid grid-cols-[1fr_118px] gap-2">
            <input
              dir="ltr"
              inputMode="numeric"
              value={amount}
              onChange={(event) => onAmountChange(event.target.value.replace(/[^0-9]/g, ''))}
              className="min-h-[58px] rounded-[20px] border border-stone-200 bg-white px-4 text-left text-[24px] font-black text-stone-950 outline-none transition placeholder:text-stone-300 focus:border-[#302B27] focus:ring-4 focus:ring-stone-100"
              placeholder="1000"
            />
            <select
              dir="ltr"
              value={currency}
              onChange={(event) => onCurrencyChange(event.target.value)}
              className="min-h-[58px] rounded-[20px] border border-stone-200 bg-stone-50 px-3 text-center text-[16px] font-black text-stone-950 outline-none transition focus:border-[#302B27] focus:ring-4 focus:ring-stone-100"
            >
              {MONEY_TRANSFER_CURRENCIES.map((currencyCode) => (
                <option key={currencyCode} value={currencyCode}>
                  {currencyCode}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>

      <button
        type="button"
        onClick={onSearch}
        className="mt-4 flex min-h-[58px] w-full items-center justify-center gap-2 rounded-[20px] bg-[#302B27] px-5 text-[16px] font-black text-white shadow-[0_14px_30px_rgba(48,43,39,0.26)] transition hover:bg-[#1f1b18] active:scale-[0.99]"
      >
        {loading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
        ) : (
          <Search className="h-5 w-5" />
        )}
        ابحث عن أفضل تحويل
      </button>
    </div>
  );
}
