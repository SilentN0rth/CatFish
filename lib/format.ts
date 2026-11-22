import type { GciDimension, Tone } from "./types";

/** Liczba z przecinkiem dziesiętnym (format polski). */
export const fmt = (v: number, d = 2) => v.toFixed(d).replace(".", ",");

/** Liczba bez wymuszonej liczby miejsc po przecinku. */
export const plNum = (v: number | string) => String(v).replace(".", ",");

export const nowPl = () => {
  const d = new Date();
  return (
    d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" }) +
    " " +
    d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
  );
};

/** GCI = 100 × Σ(waga × wartość) / Σ wag. */
export const gciValue = (dims: GciDimension[]) => {
  const sw = dims.reduce((a, x) => a + x.w, 0) || 1;
  return Math.round((100 * dims.reduce((a, x) => a + x.w * x.v, 0)) / sw);
};

export const gciContribution = (dims: GciDimension[], i: number) => {
  const sw = dims.reduce((a, x) => a + x.w, 0) || 1;
  return (100 * dims[i].w * dims[i].v) / sw;
};

export const gciBand = (g: number): [string, string] =>
  g >= 70
    ? ["wysoka złożoność", "var(--red)"]
    : g >= 55
      ? ["podwyższona złożoność", "var(--orange)"]
      : g >= 40
        ? ["umiarkowana złożoność", "var(--blue)"]
        : ["niska złożoność", "var(--green)"];

export const gciTone = (g: number): Tone => (g >= 70 ? "red" : g >= 55 ? "orange" : g >= 40 ? "blue" : "green");

/** Kolor odcinka trasy na mapie. */
export const gciColor = (g: number) => (g >= 70 ? "var(--red)" : g >= 55 ? "var(--orange)" : g >= 40 ? "#E0B12B" : "var(--green)");

export const sevColor: Record<string, string> = {
  wysokie: "var(--red)",
  średnie: "var(--orange)",
  niskie: "var(--green)",
};

/** Tło półprzezroczyste w kolorze znaczenia. */
export const tint = (color: string, pct = 14) => `color-mix(in srgb,${color} ${pct}%,transparent)`;

/** CSV z separatorem średnika (Excel PL). */
export const toCSV = (rows: Record<string, unknown>[]) => {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const cell = (raw: unknown) => {
    const v = typeof raw === "object" && raw ? JSON.stringify(raw) : String(raw ?? "");
    return /[";\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  };
  return [keys.join(";"), ...rows.map((r) => keys.map((k) => cell(r[k])).join(";"))].join("\n");
};
