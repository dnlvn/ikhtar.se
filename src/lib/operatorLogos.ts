// src/lib/operatorLogos.ts

export type OperatorSlug =
  | 'hallon'
  | 'vimla'
  | 'comviq'
  | 'fello'
  | 'tele2'
  | 'telenor'
  | 'telia'
  | 'tre'
  | 'chili';

export const OPERATOR_LOGOS: Record<OperatorSlug, string> = {
  hallon: '/assets/operators/hallon.png',
  vimla: '/assets/operators/vimla.png',
  comviq: '/assets/operators/comviq.png',
  fello: '/assets/operators/fello.png',
  tele2: '/assets/operators/tele2.png',
  telenor: '/assets/operators/telenor.png',
  telia: '/assets/operators/telia.png',
  tre: '/assets/operators/tre.png',
  chili: '/assets/operators/chili.png',
};

function slugifyOperator(input?: string | null): OperatorSlug | null {
  if (!input) return null;

  const s = input.toLowerCase().trim();

  if (s.includes('hallon')) return 'hallon';
  if (s.includes('vimla')) return 'vimla';
  if (s.includes('comviq')) return 'comviq';
  if (s.includes('fello')) return 'fello';
  if (s.includes('tele2')) return 'tele2';
  if (s.includes('telenor')) return 'telenor';
  if (s.includes('telia')) return 'telia';
  if (s === '3' || s.includes('tre')) return 'tre';
  if (s.includes('chili')) return 'chili';

  return null;
}

/**
 * Main helper used in components (PlanDetailsModal, cards, etc.)
 * Returns a public/ path (served by Vite/Vercel).
 */
export function getOperatorLogo(operatorNameOrSlug?: string | null): string | null {
  const slug = slugifyOperator(operatorNameOrSlug);
  if (!slug) return null;
  return OPERATOR_LOGOS[slug] ?? null;
}

/**
 * Backwards-compatible export if other files import operatorLogos
 */
export const operatorLogos = OPERATOR_LOGOS;
