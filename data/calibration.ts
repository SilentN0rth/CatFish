import type { Tone } from "@/lib/types";

export type CalibCategory = "progi" | "wagi" | "pewnosc" | "reguly" | "normy" | "podob";
export type CalibSourceState = "w_prototypie" | "adapter_napisany" | "do_podlaczenia" | "panel_ekspercki";

export const CALIB_SOURCE_STATE: Record<CalibSourceState, { label: string; tone: Tone }> = {
  w_prototypie: { label: "w prototypie", tone: "green" },
  adapter_napisany: { label: "adapter napisany", tone: "amber" },
  do_podlaczenia: { label: "do podłączenia", tone: "" },
  panel_ekspercki: { label: "panel ekspercki", tone: "blue" },
};

export const CALIB_SOURCES: Record<CalibCategory, [string, CalibSourceState][]> = {
  progi: [["Folder projektu: xlsx (22 projekty) i 3 dokumenty", "w_prototypie"], ["Sloty danych (EGiB, GESUT/KIUT, BDOT10k/NMT, środowisko)", "w_prototypie"], ["GUGiK / Geoportal: BDOT10k, NMT, KIEG, KIUT", "do_podlaczenia"], ["MPHP (Wody Polskie) – sieć cieków", "do_podlaczenia"], ["GDOŚ – Natura 2000 (WMS/WFS)", "do_podlaczenia"], ["PIG-PIB hydrogeologia · ISOK mapy powodziowe", "do_podlaczenia"], ["Wnioski o dofinansowanie – przebieg tras", "do_podlaczenia"]],
  wagi: [["Panel ekspertów MFiPR / IW / doradca techniczny", "panel_ekspercki"], ["Raporty NIK o inwestycjach wod-kan i KPOŚK", "do_podlaczenia"], ["Historia projektów z decyzjami eksperta", "w_prototypie"]],
  pewnosc: [["Decyzje eksperta w panelu (zatwierdź / popraw / odrzuć)", "w_prototypie"], ["Decyzje w kontroli jakości", "w_prototypie"], ["Biała lista VAT, REGON (BIR GUS), KRS", "do_podlaczenia"]],
  reguly: [["Decyzje eksperta w jakości i monitoringu, w tym „fałszywy alarm”", "w_prototypie"], ["BZP – ogłoszenia o zmianie i wykonaniu umowy", "adapter_napisany"], ["KIO – orzeczenia", "do_podlaczenia"], ["IMGW – dane dobowe (reguła W01, pogoda)", "do_podlaczenia"]],
  normy: [["Folder projektu: xlsx + dokumenty", "w_prototypie"], ["BZP (e-Zamówienia) i TED", "adapter_napisany"], ["Sprawozdania z realizacji KPOŚK (Wody Polskie)", "do_podlaczenia"], ["Lista projektów FE / CST2021 / KPO", "do_podlaczenia"], ["Sekocenbud, Intercenbud, Orgbud, KNR 2-18", "do_podlaczenia"], ["GUS – BDL (infrastruktura komunalna)", "do_podlaczenia"], ["IMGW – wielolecie: mróz, opad, pokrywa śnieżna", "do_podlaczenia"]],
  podob: [["Oceny trafności „tak / nie” w analizie nowej inwestycji", "w_prototypie"], ["Lista projektów FE / CST2021 / KPO i BZP", "do_podlaczenia"], ["GUS / PRG – typ gminy, gęstość zaludnienia", "do_podlaczenia"]],
};

/** Wersje kalibracji: [wersja, data, autor, zmiana]. */
export const CALIB_VERSIONS: Record<CalibCategory, [string, string, string, string][]> = {
  progi: [["v2", "20.11.2026", "Ekspert sektorowy", "Natura 2000: P90 400 → 500 m"]],
  wagi: [["v4", "21.11.2026", "Panel 3 ekspertów", "Osobne wagi dla wodociągu i kanalizacji"], ["v3", "20.11.2026", "Ekspert sektorowy", "Środowisko i cieki 0,16 → 0,20"]],
  pewnosc: [["v2", "19.11.2026", "Ekspert sektorowy", "Transkrypcja skanu 0,7 → 0,6"]],
  reguly: [["v5", "21.11.2026", "Opiekun umowy", "Q07: tolerancja 0 dni; nowa reguła W01 (pogoda)"]],
  normy: [["v3", "21.11.2026", "Ekspert sektorowy", "Korekta zimowa z IMGW zamiast płaskiej ×1,3"]],
  podob: [["v1", "18.11.2026", "Ekspert sektorowy", "Wagi startowe"]],
};

export const CALIB_CATEGORIES: { k: CalibCategory; n: string; status: string; sample: string }[] = [
  { k: "progi", n: "Progi cech GCI", status: "założenie eksperckie", sample: "n = 3" },
  { k: "wagi", n: "Wagi ekspertów", status: "założenie eksperckie", sample: "3 ekspertów" },
  { k: "pewnosc", n: "Pewność", status: "częściowo", sample: "41 decyzji" },
  { k: "reguly", n: "Reguły i alarmy", status: "skalibrowane", sample: "n = 42" },
  { k: "normy", n: "Normy dni/km i zł/km", status: "założenie eksperckie", sample: "n = 1–4" },
  { k: "podob", n: "Podobieństwo", status: "skalibrowane", sample: "12 ocen" },
];

/** Progi cech GCI: [cecha, jednostka, P50 (40 pkt), P90 (100 pkt), n]. */
export const THRESHOLDS: [string, string, number, number, number][] = [
  ["Udział działek prywatnych", "udział 0–1", 0.3, 0.8, 3],
  ["Kolizje z uzbrojeniem", "kolizje / km", 5, 15, 3],
  ["Przekroczenia cieków", "liczba", 2, 5, 3],
  ["Przejścia pod drogami i torami", "liczba", 1, 4, 3],
  ["Głębokość posadowienia", "m", 3, 6, 1],
  ["Natura 2000 na trasie", "m", 100, 500, 2],
  ["Wiek dokumentacji", "lata", 5, 15, 2],
];

export type ExpertWeightsKind = "kan" | "wod";

/** Wagi trzech ekspertów (punkty ze 100): [cecha, A, B, C]. */
export const EXPERT_WEIGHTS: Record<ExpertWeightsKind, [string, number, number, number][]> = {
  kan: [["Zabudowa i kolizje", 20, 16, 18], ["Grunty prywatne", 14, 12, 16], ["Przekroczenia cieków", 10, 14, 12], ["Natura 2000", 12, 10, 14], ["Wody gruntowe", 14, 16, 12], ["Morfologia (NMT)", 10, 8, 9], ["Przejścia drogi / tory", 8, 10, 7], ["Prace w czynnej sieci", 4, 6, 4], ["Wiek dokumentacji", 8, 8, 8]],
  wod: [["Zabudowa i kolizje", 22, 20, 24], ["Grunty prywatne", 16, 14, 15], ["Przekroczenia cieków", 10, 12, 10], ["Natura 2000", 10, 8, 9], ["Wody gruntowe", 6, 8, 7], ["Morfologia (NMT)", 6, 6, 5], ["Przejścia drogi / tory", 10, 12, 10], ["Prace w czynnej sieci", 12, 12, 12], ["Wiek dokumentacji", 8, 8, 8]],
};

/** Test odporności ±20%: [projekt, GCI, min, max, stabilne]. */
export const ROBUSTNESS: [string, number, number, number, boolean][] = [
  ["Zagrodno", 63, 60, 66, true],
  ["Brzozowa – Lipnik", 61, 58, 64, true],
  ["Grodzisko Dolne", 57, 54, 60, false],
  ["Zławieś Wielka", 52, 49, 55, false],
];

/** Składowe pewności. */
export const CONFIDENCE_PARTS: [string, [string, number][]][] = [
  ["Jakość źródła", [["rejestr", 1], ["dokument natywny", 0.9], ["transkrypcja skanu", 0.6], ["odczyt ręczny", 0.5], ["brak", 0.2]]],
  ["Siła dopasowania", [["L1 identyfikator publiczny", 0.98], ["L2 NIP", 0.9], ["L3 tytuł + gmina", 0.85], ["brak", 0.5]]],
  ["Siła wnioskowania", [["sygnał i zdarzenie", 0.8], ["tylko sygnał", 0.5], ["tylko opis", 0.35]]],
  ["Kompletność", [["wiele dokumentów", 0.5], ["jeden dokument", 0.3]]],
];

/** Wykres kalibracji pewności: [przedział, środek, odsetek zatwierdzeń, n]. */
export const CONFIDENCE_BINS: [string, number, number, number][] = [
  ["0–0,3", 0.15, 0.25, 4],
  ["0,3–0,45", 0.375, 0.4, 5],
  ["0,45–0,6", 0.525, 0.58, 9],
  ["0,6–0,75", 0.675, 0.64, 11],
  ["0,75–1", 0.875, 0.86, 12],
];

/** Reguły i alarmy: [kod, nazwa, alarmy, odrzucone]. Odrzucenia V09 rosną z przyciskiem „Fałszywy alarm”. */
export const RULE_ALARMS: [string, string, number, number][] = [
  ["Q07", "Zmiana w dniu upływu terminu", 8, 3],
  ["Q09", "Brak podstawy z art. 455 Pzp", 6, 1],
  ["Q10", "Mieszanie podstaw art. 455", 4, 0],
  ["Q11", "Oczekiwane ogłoszenie o zmianie", 5, 1],
  ["Q18", "Skan bez warstwy tekstowej", 9, 6],
  ["V09", "Monitoring: zmiana blisko końca umowy", 7, 4],
  ["W01", "Pogoda w protokole a dane IMGW", 3, 0],
];

/** Normy: [metoda, podsektor, dni/km, zł/km, n]. */
export const NORMS: [string, string, string, string, number][] = [
  ["Wykop otwarty", "Kanalizacja sanitarna", "31", "1,9 mln", 4],
  ["Wykop otwarty", "Sieć wodociągowa", "22", "0,62 mln", 1],
  ["Przewiert sterowany", "Kanalizacja sanitarna", "—", "—", 0],
  ["Przewiert sterowany", "Sieć wodociągowa", "—", "—", 0],
  ["Relining / renowacja", "Kanalizacja sanitarna", "—", "—", 0],
  ["Relining / renowacja", "Sieć wodociągowa", "—", "—", 0],
];

/** Korekta zimowa IMGW wg regionu: [województwo, współczynnik, dni mroźne]. */
export const WINTER_REGIONS: [string, number, number][] = [
  ["dolnośląskie", 1.16, 42],
  ["kujawsko-pomorskie", 1.22, 51],
  ["podkarpackie", 1.27, 58],
  ["wielkopolskie", 1.2, 48],
  ["warmińsko-mazurskie", 1.31, 66],
  ["zachodniopomorskie", 1.17, 44],
];

/** Wagi podobieństwa: [cecha, obecna, proponowana]. */
export const SIMILARITY_WEIGHTS: [string, number, number][] = [
  ["Podsektor", 0.3, 0.3],
  ["Rodzaj prac", 0.15, 0.15],
  ["Region", 0.1, 0.1],
  ["Długość", 0.15, 0.21],
  ["Opis (słowa kluczowe)", 0.3, 0.24],
];

export const SIMILARITY_RATINGS: [string, string, "tak" | "nie"][] = [
  ["RM-2026-002", "Zagrodno", "tak"],
  ["RM-2026-010", "Grodzisko Dolne", "tak"],
  ["RM-2026-005", "Zławieś Wielka", "nie"],
  ["RM-2026-017", "Kleszczewo", "tak"],
];
