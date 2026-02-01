// src/lib/operatorLogos.ts

export const operatorLogos: Record<string, string> = {
  hallon: "/assets/operators/hallon.png",
  vimla: "/assets/operators/vimla.png",
  comviq: "/assets/operators/comviq.png",
  fello: "/assets/operators/fello.png",
  tele2: "/assets/operators/tele2.png",
  telenor: "/assets/operators/telenor.png",
  telia: "/assets/operators/telia.png",
  tre: "/assets/operators/tre.png",
  chili: "/assets/operators/chili.png",
};

// Normalisera operatornamn till samma nycklar som filnamnen
function normalizeOperatorKey(input?: string | null): string {
  const s = (input ?? "").trim().toLowerCase();
  if (!s) return "";

  // vanliga varianter
  if (s === "3") return "tre";
  if (s === "three") return "tre";
  if (s.includes("telenor")) return "telenor";
  if (s.includes("tele2")) return "tele2";
  if (s.includes("telia")) return "telia";
  if (s.includes("hallon")) return "hallon";
  if (s.includes("vimla")) return "vimla";
  if (s.includes("comviq")) return "comviq";
  if (s.includes("fello")) return "fello";
  if (s.includes("tre")) return "tre";
  if (s.includes("chili")) return "chili";

  return s.replace(/\s+/g, "");
}

/**
 * Returns a public URL under /assets/operators/... (served from /public).
 * Returns null if not found.
 */
export function getOperatorLogo(operator?: string | null): string | null {
  const key = normalizeOperatorKey(operator);
  if (!key) return null;
  return operatorLogos[key] ?? null;
}
