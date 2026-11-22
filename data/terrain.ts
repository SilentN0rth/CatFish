import type { HotSpot, LayerKey, Route, Variant } from "@/lib/types";

/** Warianty trasy Brzozowa – Lipnik (współrzędne poglądowej mapy 800 × 520). */
export const ROUTES: Record<Variant, Route> = {
  A: { pts: [[80, 430], [190, 390], [290, 345], [385, 300], [470, 245], [575, 185], [700, 90]], gci: [38, 62, 88, 74, 58, 71], len: "7,8" },
  B: { pts: [[80, 430], [200, 455], [320, 440], [430, 415], [540, 360], [640, 300], [720, 250]], gci: [38, 41, 55, 49, 44, 52], len: "8,4" },
};

export const SEGMENT_NAMES: Record<Variant, string[]> = {
  A: ["Brzozowa – zabudowa rozproszona", "Brzozowa – centrum, wodociąg Ø110", "Potok Brzozówka · Natura 2000", "Tereny podmokłe · PS2", "Lipnik – droga wojewódzka", "Przejście pod torami → oczyszczalnia"],
  B: ["Brzozowa – zabudowa rozproszona", "Grunty orne, działki gminne", "Potok Brzozówka (poza Natura 2000)", "Lipnik – południe", "Lipnik – droga wojewódzka", "Włączenie do kolektora w Lipniku"],
};

export const HOTSPOTS: HotSpot[] = [
  { x: 385, y: 300, n: 1, t: "Przekroczenie potoku w obszarze Natura 2000", g: 88, d: "Wymiary: Środowisko 0,92 · Woda 0,81. Uzgodnienia RDOŚ i Wody Polskie; okno lęgowe IV–VII." },
  { x: 290, y: 345, n: 2, t: "Zwarta zabudowa i wodociąg Ø110", g: 62, d: "11 skrzyżowań z sieciami (GESUT). Ten sam typ kolizji co w Zagrodnie." },
  { x: 470, y: 245, n: 3, t: "Tereny podmokłe przy PS2", g: 74, d: "Wody gruntowe ok. 1,2 m p.p.t. (z opisu). Potrzebne badania geotechniczne." },
  { x: 648, y: 138, n: 4, t: "Przejście pod linią kolejową", g: 71, d: "Przewiert pod torami, uzgodnienie z zarządcą infrastruktury kolejowej." },
];

export const MAP_LAYERS: { k: LayerKey; n: string }[] = [
  { k: "orto", n: "Ortofotomapa" },
  { k: "bdot", n: "BDOT10k – budynki" },
  { k: "egib", n: "EGiB – działki" },
  { k: "gesut", n: "GESUT – sieci" },
  { k: "n2k", n: "Natura 2000 (GDOŚ)" },
  { k: "cieki", n: "Cieki (MPHP)" },
  { k: "isok", n: "Zagrożenie powodziowe (ISOK)" },
  { k: "hs", n: "Punkty zapalne" },
];

/** Porównanie wariantów: [cecha, A, B, czy lepszy jest B]. */
export const VARIANT_COMPARISON: { n: string; a: string; b: string; bBetter: boolean }[] = [
  { n: "GCI trasy", a: "61", b: "47", bBetter: true },
  { n: "Długość [km]", a: "7,8", b: "8,4", bBetter: false },
  { n: "Natura 2000 [m]", a: "420", b: "0", bBetter: true },
  { n: "Przekroczenia cieków", a: "2", b: "1", bBetter: true },
  { n: "Działki prywatne", a: "64", b: "38", bBetter: true },
  { n: "Przejścia pod torami", a: "1", b: "0", bBetter: true },
  { n: "Skrzyżowania z sieciami", a: "11", b: "6", bBetter: true },
  { n: "Przepompownie", a: "2", b: "3", bBetter: false },
  { n: "W strefie ISOK Q1% [m]", a: "180", b: "60", bBetter: true },
  { n: "Przykrycie min. vs przemarzanie [m]", a: "+0,1", b: "+0,3", bBetter: true },
];
