/** Średnia liczba dni w miesiącu w oknie robót: [miesiąc, dni z mrozem, dni z opadem ≥ 10 mm]. Dane przykładowe. */
export const WEATHER_MONTHS: [string, number, number][] = [
  ["III", 11, 1],
  ["IV", 4, 1],
  ["V", 0, 2],
  ["VI", 0, 2],
  ["VII", 0, 3],
  ["VIII", 0, 2],
];

/** Typ dnia w weryfikacji reguły W01: f = mróz, s = śnieg, r = opad, o = dzień dogodny. */
export type WeatherDay = "f" | "s" | "r" | "o";

const BAD: Record<number, WeatherDay> = { 0: "f", 1: "f", 2: "s", 5: "r", 6: "f", 9: "s", 10: "s", 14: "f", 15: "f", 20: "r", 24: "s", 29: "f", 33: "r" };

/** 36 dni postoju 12.01–16.02.2026 (przykład demonstracyjny). */
export const WEATHER_DAYS: WeatherDay[] = Array.from({ length: 36 }, (_, i) => BAD[i] ?? "o");

export const WEATHER_DAY_COLOR: Record<WeatherDay, string> = {
  f: "var(--blue)",
  s: "var(--fg-3)",
  r: "var(--water)",
  o: "var(--line-2)",
};

export const WEATHER_DAY_LABEL: [WeatherDay, string][] = [
  ["f", "Tmax < −5 °C"],
  ["s", "pokrywa śnieżna > 10 cm"],
  ["r", "opad ≥ 10 mm"],
  ["o", "dzień dogodny"],
];
