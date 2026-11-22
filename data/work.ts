import type { Beneficiary, Task } from "@/lib/types";

export const TASKS: Task[] = [
  { id: "T1", kiedy: "dzis", d: "dziś, 14:00", p: "RM-2026-005", t: "Zdecyduj, czy zatwierdzić aneks nr 2 (+36 dni, 151 481,54 zł)", w: "Podstawa z art. 455 nie pasuje do uzasadnienia. Możliwa korekta 37 870 zł.", pr: "wysoki", go: "projekt" },
  { id: "T2", kiedy: "dzis", d: "dziś", p: "RM-2026-002", t: "Zapytaj beneficjenta o datę podpisania aneksu", w: "Protokół sporządzono w dniu upływu terminu. Jeśli aneks jest późniejszy, grozi korekta.", pr: "wysoki", go: "projekt" },
  { id: "T3", kiedy: "dzis", d: "dziś", p: "RM-2026-002", t: "Sprawdź 30 dni postoju „z powodu pogody”", w: "IMGW potwierdza 13 z 30 dni. Reszta wymaga wyjaśnienia.", pr: "średni", go: "monitoring" },
  { id: "T4", kiedy: "tydz", d: "25.11.2026", p: "RM-2026-010", t: "Rozstrzygnij sprzeczny NIP w piśmie beneficjenta", w: "Wartość ze skanu nie przechodzi sumy kontrolnej.", pr: "średni", go: "ekspert" },
  { id: "T5", kiedy: "tydz", d: "26.11.2026", p: "Nowa inwestycja", t: "Wyślij pytania do beneficjenta przed oceną wniosku", w: "Natura 2000 na trasie, 16 dni zapasu do końca kwalifikowalności.", pr: "średni", go: "analiza" },
  { id: "T6", kiedy: "tydz", d: "27.11.2026", p: "RM-2026-012", t: "Zweryfikuj wniosek o płatność nr 4", w: "Wniosek w CST2021 czeka 9 dni z 20 dni na weryfikację.", pr: "niski", go: "projekt" },
  { id: "T7", kiedy: "pozn", d: "04.12.2026", p: "Portfel", t: "Przygotuj informację dla Komitetu Monitorującego", w: "Posiedzenie 11.12.2026. Raport generuje się z danych portfela.", pr: "niski", go: "raporty" },
  { id: "T8", kiedy: "pozn", d: "09.12.2026", p: "RM-2026-008", t: "Kontrola na miejscu: Biecz, część 1", w: "Poprzednia kontrola u beneficjenta miała 2 ustalenia.", pr: "niski", go: "beneficjent" },
];

const h = (period: string, program: string, name: string, value: string, state: string, changes: string, corrections: string) => ({ period, program, name, value, state, changes, corrections });
const k = (year: string, by: string, kind: string, result: string) => ({ year, by, kind, result });

/** Historia beneficjentów – dane wymyślone na potrzeby prototypu, nie dotyczą prawdziwych gmin. */
export const BENEFICIARIES: Record<string, Beneficiary> = {
  "RM-2026-002": {
    n: "Gmina Zagrodno", nip: "6941566139", woj: "dolnośląskie",
    h: [
      h("2014–2020", "RPO WD", "Budowa sieci wodociągowej w Zagrodnie i Uniejowicach", "3,1 mln zł", "zakończony", "aneks terminowy +60 dni", "korekta 5% (zamówienie)"),
      h("2014–2020", "PROW", "Kanalizacja sanitarna Jakuszów", "2,4 mln zł", "zakończony", "bez zmian", "—"),
      h("2021–2027", "KPO", "Budowa kanalizacji sanitarnej na terenie Gminy Zagrodno", "12,8 mln zł", "w realizacji", "2 aneksy terminowe", "—"),
    ],
    k: [k("2019", "IZ RPO WD", "kontrola zamówień", "1 ustalenie: niejasne kryteria oceny ofert"), k("2024", "IZ KPO", "kontrola na miejscu", "bez ustaleń")],
  },
  "RM-2026-005": {
    n: "Gmina Zławieś Wielka", nip: "8792469951", woj: "kujawsko-pomorskie",
    h: [
      h("2014–2020", "RPO K-P", "Rozbudowa SUW Czarnowo", "4,2 mln zł", "zakończony", "aneks wartościowy +8%", "—"),
      h("2021–2027", "KPO", "Budowa sieci kanalizacji sanitarnej w Zławsi Wielkiej", "9,6 mln zł", "w realizacji", "aneks nr 2: +36 dni, +151 481,54 zł", "—"),
    ],
    k: [k("2022", "IZ RPO K-P", "kontrola trwałości", "bez ustaleń")],
  },
  "RM-2026-010": {
    n: "Gmina Grodzisko Dolne", nip: "8161570014", woj: "podkarpackie",
    h: [
      h("2007–2013", "RPO WP", "Kanalizacja Wólka Grodziska", "5,0 mln zł", "zakończony", "aneks terminowy +120 dni", "korekta 10% (zmiana umowy)"),
      h("2014–2020", "RPO WP", "Wodociąg Laszczyny", "1,9 mln zł", "zakończony", "bez zmian", "—"),
      h("2021–2027", "KPO", "Kanalizacja sanitarna Zmysłówka i Grodzisko", "7,3 mln zł", "w realizacji", "1 aneks terminowy", "—"),
    ],
    k: [k("2016", "IZ RPO WP", "kontrola zamówień", "korekta 10% za zmianę umowy"), k("2021", "IA (KAS)", "audyt operacji", "1 ustalenie: dokumentacja odbioru")],
  },
  "RM-2026-008": {
    n: "Gmina Biecz", nip: "", woj: "małopolskie",
    h: [
      h("2014–2020", "RPO WM", "Sieć kanalizacyjna Racławice", "6,4 mln zł", "zakończony", "aneks terminowy +45 dni", "—"),
      h("2021–2027", "FEM", "Budowa sieci kanalizacji sanitarnej – część 1", "11,2 mln zł", "postępowanie", "—", "—"),
    ],
    k: [k("2020", "IZ RPO WM", "kontrola na miejscu", "2 ustalenia: oznakowanie, dokumentacja powykonawcza")],
  },
};

/** Ślad audytowy: [kiedy, kto, co, dotyczy, szczegóły, wersja ustawień, źródło, skrót]. */
export const AUDIT: string[][] = [
  ["21.11.2026 23:52", "System", "Monitoring", "RM-2026-002", "3 nowe dokumenty, ryzyko R06: średnie → wysokie", "wod-kan v1.3", "e-Zamówienia, skrzynka podawcza", "a41f…9c2"],
  ["21.11.2026 22:14", "Ekspert sektorowy", "Zatwierdzenie wniosku", "W-109", "Zgodne z protokołem, s. 1", "wod-kan v1.3", "Protokół konieczności, s. 1", "7be0…14d"],
  ["21.11.2026 21:58", "Ekspert sektorowy", "Poprawka wniosku", "W-108", "R04: wysokie → średnie, decyzja RDOŚ już wydana", "wod-kan v1.3", "Dokument beneficjenta", "c912…0aa"],
  ["21.11.2026 21:40", "Opiekun umowy", "Odrzucenie wniosku", "W-107", "Kwota dotyczy innej części zamówienia", "wod-kan v1.2", "Aneks nr 1", "55d3…e71"],
  ["21.11.2026 18:05", "System", "Pobranie źródła", "Lista projektów KPO", "412 projektów, 3 nowe", "—", "kpo.gov.pl", "0f6c…b38"],
  ["20.11.2026 16:05", "Ekspert sektorowy", "Nowa wersja wag GCI", "Pakiet wod-kan", "Środowisko i cieki 0,16 → 0,20", "wod-kan v1.3", "Przegląd projektów z Natura 2000", "e2a7…5d1"],
  ["20.11.2026 11:20", "Opiekun umowy", "Wniosek o dostęp", "GESUT, powiat złotoryjski", "Wniosek z art. 24 ust. 5 Pgik", "—", "—", "91c4…7f0"],
];
