export const DISABLED_MOBILE_PROVIDERS = ['hallon'] as const;

function normalizeMobileProvider(providerName?: string | null): string {
  return providerName?.trim().toLowerCase() ?? '';
}

export function isMobileProviderDisabled(providerName?: string | null): boolean {
  const normalizedProvider = normalizeMobileProvider(providerName);
  return DISABLED_MOBILE_PROVIDERS.some(
    (provider) => normalizeMobileProvider(provider) === normalizedProvider
  );
}
