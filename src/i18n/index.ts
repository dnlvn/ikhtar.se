/**
 * i18n Translation Helper
 * Simple dictionary-based translation for Arabic-only site
 */

import { ar, type Translation } from './ar';

// Always use Arabic - no language switcher
const translations: Translation = ar;

/**
 * Get a nested translation value by dot-notation key
 * Example: t('hero.title.highlight') => 'باقات الجوال'
 * Can return strings, arrays, or objects
 */
export function t(key: string): any {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key; // Return key as fallback
    }
  }
  
  return value;
}

/**
 * Get a translation with dynamic variable replacement
 * Example: t('card.savePerMonth', { amount: 50 }) => 'وفّر 50 كرونة/شهريًا'
 */
export function tr(key: string, replacements: Record<string, string | number>): string {
  let text = t(key);
  
  // Ensure text is a string
  if (typeof text !== 'string') {
    text = String(text);
  }
  
  for (const [placeholder, value] of Object.entries(replacements)) {
    text = text.replace(`{${placeholder}}`, String(value));
  }
  
  return text;
}

/**
 * Format currency for Arabic
 * Example: formatCurrency(49) => '49'
 */
export function formatCurrency(amount: number): string {
  return amount.toString();
}

/**
 * Format number for Arabic (RTL-safe)
 */
export function formatNumber(num: number): string {
  return num.toString();
}

// Export the translations object for direct access if needed
export { ar };