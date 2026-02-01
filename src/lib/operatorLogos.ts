// src/lib/operatorLogos.ts
// NOTE: Do NOT import figma:asset here. Vercel/Vite cannot resolve those.
// Put your exported logo files in: /public/assets/operators/

export const operatorLogos: Record<string, string> = {
  Hallon: "/assets/operators/hallon.png",
  Vimla: "/assets/operators/vimla.png",
  Comviq: "/assets/operators/comviq.png",
  Fello: "/assets/operators/fello.png",
  Telia: "/assets/operators/telia.png",
  Tre: "/assets/operators/tre.png",
  Telenor: "/assets/operators/telenor.png",
  Tele2: "/assets/operators/tele2.png",
};

export function getOperatorLogo(operator?: string): string | undefined {
  if (!operator) return undefined;
  return operatorLogos[operator];
}
