// src/lib/operatorLogos.ts

export type OperatorSlug =
  | "hallon"
  | "comviq"
  | "fello"
  | "telenor"
  | "tre"
  | "vimla"
  | "telia"
  | "tele2";

export const operatorLogoUrl: Record<OperatorSlug, string> = {
  hallon: "/operator-logos/hallon.png",
  comviq: "/operator-logos/comviq.png",
  fello: "/operator-logos/fello.png",
  telenor: "/operator-logos/telenor.png",
  tre: "/operator-logos/tre.png",
  vimla: "/operator-logos/vimla.png",
  telia: "/operator-logos/telia.png",
  tele2: "/operator-logos/tele2.png",
};

export function getOperatorLogoUrl(operator: string | null | undefined): string | null {
  const slug = (operator || "").trim().toLowerCase();

  // om du ibland sparar "Tre" eller "Tre.se" etc.
  const normalized =
    slug === "3" || slug === "tre.se" ? "tre" :
    slug;

  if (normalized in operatorLogoUrl) {
    return operatorLogoUrl[normalized as OperatorSlug];
  }
  return null;
}
