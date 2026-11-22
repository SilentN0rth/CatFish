import type { Correction, Project, ProjectDetail, SourceDocument, DocKey } from "@/lib/types";

/** Data i godzina ostatniego pobrania danych testowych. */
export const PULLED = "21.11.2026, 23:52";

/** Projekty sieci wod-kan z pliku organizatora (Risk_Miner_dane_projekty.xlsx). */
export const PROJECTS: Project[] = [
  { id: "RM-2026-001", gm: "Gmina Oława", woj: "dolnośląskie", nm: "Budowa rurociągu tłocznego kanalizacji sanitarnej Godzikowice", ps: "Kanalizacja sanitarna", rp: "Budowa", gci: 44, st: "Zakończony", r: ["R03"], pub: "2022/BZP 00058537/01" },
  { id: "RM-2026-002", gm: "Gmina Zagrodno", woj: "dolnośląskie", nm: "Budowa kanalizacji sanitarnej na terenie Gminy Zagrodno", ps: "Kanalizacja sanitarna", rp: "Budowa", gci: 63, st: "W realizacji", r: ["R02", "R03", "R06", "R15"], pub: "KPOD.03.15-IW.13-0004/25", alert: true },
  { id: "RM-2026-005", gm: "Gmina Zławieś Wielka", woj: "kujawsko-pomorskie", nm: "Budowa sieci kanalizacji sanitarnej w miejscowości Zławieś Wielka", ps: "Kanalizacja sanitarna", ps2: "Sieć wodociągowa (SUW)", rp: "Budowa", gci: 52, st: "W realizacji", r: ["R07", "R13"], pub: "KPOD.03.15-IW.14-0032/25", alert: true },
  { id: "RM-2026-007", gm: "Gmina Kamionka", woj: "lubelskie", nm: "Rozbudowa sieci wodociągowej w gminie Kamionka", ps: "Sieć wodociągowa", rp: "Rozbudowa", gci: 38, st: "W realizacji", r: ["R03"], pub: "KPOD.03.15-IW.15-0081/25" },
  { id: "RM-2026-008", gm: "Gmina Biecz", woj: "małopolskie", nm: "Budowa sieci kanalizacji sanitarnej na terenie Gminy Biecz – część 1", ps: "Kanalizacja sanitarna", rp: "Budowa", gci: 58, st: "Postępowanie", r: ["R02", "R04"], pub: "2026/BZP 00084760/01" },
  { id: "RM-2026-009", gm: "Gmina Zakrzew", woj: "mazowieckie", nm: "Budowa sieci wodociągowej na terenie gminy Zakrzew – część 2", ps: "Sieć wodociągowa", rp: "Budowa", gci: 35, st: "W realizacji", r: ["R03"], pub: "2025/BZP 00307948/01" },
  { id: "RM-2026-010", gm: "Gmina Grodzisko Dolne", woj: "podkarpackie", nm: "Budowa kanalizacji sanitarnej w miejscowości Zmysłówka i Grodzisko", ps: "Kanalizacja sanitarna", rp: "Budowa", gci: 57, st: "W realizacji", r: ["R02", "R03", "R13"], pub: "KPOD.03.15-IW.21-0025/25", alert: true },
  { id: "RM-2026-012", gm: "Gmina Kartuzy", woj: "pomorskie", nm: "Budowa tranzytu przesyłowego sieci kanalizacji sanitarnej", ps: "Kanalizacja sanitarna", rp: "Budowa", gci: 66, st: "W realizacji", r: ["R03", "R04"], pub: "2025/BZP 00119683/01" },
  { id: "RM-2026-015", gm: "Gmina Elbląg", woj: "warmińsko-mazurskie", nm: "Przebudowa sieci wodociągowej oraz kanalizacji sanitarnej", ps: "Sieć wodociągowa", ps2: "Kanalizacja sanitarna", rp: "Przebudowa", gci: 61, st: "Zakończony", r: ["R02"], pub: "2023/BZP 00135041/01" },
  { id: "RM-2026-016", gm: "Gmina Miłakowo", woj: "warmińsko-mazurskie", nm: "Budowa sieci wodociągowej o długości 22,616 km i sieci kanalizacji", ps: "Sieć wodociągowa", ps2: "Kanalizacja sanitarna", rp: "Budowa", gci: 55, st: "Zakończony", r: ["R06"], pub: "2022/BZP 00308854/01" },
  { id: "RM-2026-017", gm: "Gmina Kleszczewo", woj: "wielkopolskie", nm: "Budowa sieci kanalizacji sanitarnej wraz z przyłączami", ps: "Kanalizacja sanitarna", rp: "Budowa", gci: 41, st: "W realizacji", r: ["R06"], pub: "KPOD.03.15-IW.27-0013/25" },
  { id: "RM-2026-022", gm: "Gmina Wolin", woj: "zachodniopomorskie", nm: "Budowa sieci wodociągowych i kanalizacji sanitarnej w Gminie Wolin", ps: "Sieć wodociągowa", ps2: "Kanalizacja sanitarna", rp: "Budowa", gci: 59, st: "Zakończony", r: ["R04"], pub: "2023/BZP 00110672/01" },
];

/** Projekty z pełną kartą w prototypie. */
export const DETAILED_IDS = ["RM-2026-002", "RM-2026-005", "RM-2026-010"] as const;

export const DETAIL: Record<string, ProjectDetail> = {
  "RM-2026-002": {
    short: "Zagrodno",
    nip: "6941566139",
    kpo: "KPOD.03.15-IW.13-0004/25",
    match: { layer: "L1 · numer KPO", score: 0.98 },
    facts: [
      { t: "Umowa z wykonawcą nr IR.271.1.2026 z 05.03.2026", l: "src", s: "zidentyfikowana z odwołania w protokole; brak pliku umowy w przeanalizowanych źródłach", doc: "zagrodno", p: 1, q: "…w związku z realizacją umowy nr IR.271.1.2026 z dnia 05.03.2026 r…" },
      { t: "Termin wykonania: 05.05.2026 → 05.06.2026 (+1 miesiąc)", l: "calc", s: "„wydłużenie o 1 miesiąc” przeliczone na daty kalendarzowe", doc: "zagrodno", p: 2, q: "…konieczność wydłużenia terminu realizacji o 1 miesiąc…" },
      { t: "Przyczyna: kolizja projektowanej sieci z istniejącym wodociągiem", l: "src", risk: "R03", doc: "zagrodno", p: 1, q: "…stwierdzono kolizję projektowanego kanału z istniejącą siecią wodociągową…" },
      { t: "Przyczyna: wysoki poziom wód gruntowych przy pompowni PM2", l: "src", risk: "R02", doc: "zagrodno", p: 1, q: "…w rejonie przepompowni PM2 wystąpił wysoki poziom wód gruntowych…" },
      { t: "Zależność od oczyszczalni realizowanej równolegle (efekt +4 mies.)", l: "model", risk: "R06 · R15", doc: "zagrodno", p: 2, q: "…włączenie do oczyszczalni możliwe po zakończeniu jej przebudowy…" },
      { t: "Protokół sporządzono w dniu upływu pierwotnego terminu", l: "calc", rule: "Q07", s: "data protokołu = data końca umowy; do weryfikacji przez opiekuna umowy" },
      { t: "Protokół nie wskazuje podstawy zmiany z art. 455 Pzp", l: "calc", rule: "Q09", s: "nie znaleziono w przeanalizowanych źródłach; ocena prawna należy do opiekuna umowy" },
      { t: "Sygnał wczesny: opis w xlsx wspomina oczyszczalnię „realizowaną obecnie”", l: "src", s: "sygnał R06 był widoczny przed rozpoczęciem robót", doc: "xlsx", p: "wiersz 3" },
    ],
    timeline: [
      { when: "05.03.2026", title: "Podpisanie umowy IR.271.1.2026", tone: "", kind: "z odwołania" },
      { when: "05.05.2026", title: "Pierwotny termin wykonania · protokół konieczności aneksowania", tone: "red", kind: "dokument" },
      { when: "05.06.2026", title: "Termin po wydłużeniu (+1 mies.)", tone: "orange", kind: "obliczenie" },
      { when: "IX 2026", title: "Przewidywany efekt ekologiczny (+4 mies., zależny od oczyszczalni)", tone: "orange", kind: "wniosek modelu" },
    ],
    pkg: [
      { name: "Ogłoszenie o zamówieniu (BZP)", status: "missing" },
      { name: "SWZ", status: "missing" },
      { name: "PFU / OPZ", status: "missing" },
      { name: "PPU / SWU", status: "missing" },
      { name: "Podpisana umowa z wykonawcą", status: "ref" },
      { name: "Protokół konieczności", status: "found" },
      { name: "Aneks do umowy", status: "expected" },
      { name: "Ogłoszenie o zmianie umowy", status: "expected" },
    ],
  },
  "RM-2026-005": {
    short: "Zławieś Wielka",
    nip: "8792469951",
    kpo: "KPOD.03.15-IW.14-0032/25",
    match: { layer: "L3 · tytuł + gmina", score: 0.85 },
    facts: [
      { t: "Wydłużenie terminu o 36 dni: 30.10.2025 → 05.12.2025", l: "calc", doc: "zlawies", p: 1, q: "…przedłużenie terminu wykonania zamówienia o 36 dni…" },
      { t: "Roboty dodatkowe: 151 481,54 zł brutto", l: "src", risk: "R07", doc: "zlawies", p: 1, q: "…wartość robót dodatkowych wynosi 151 481,54 zł brutto…" },
      { t: "Powołana podstawa: art. 455 ust. 1 pkt 3 Pzp; uzasadnienie opisuje okoliczności z pkt 4", l: "calc", rule: "Q10", s: "niezgodność do weryfikacji przez opiekuna umowy" },
      { t: "Oczekiwane ogłoszenie o zmianie umowy (pkt 3)", l: "calc", s: "nie znaleziono w przeanalizowanych źródłach (BZP, katalog dokumentów)" },
      { t: "Zdarzenie dotyczy filtrów na SUW – podsektor dodatkowy", l: "model", s: "ekspert decyduje, czy liczyć je dla sieci kanalizacyjnej" },
    ],
    timeline: [
      { when: "30.10.2025", title: "Pierwotny termin wykonania", tone: "red", kind: "dokument" },
      { when: "X 2025", title: "Protokół konieczności nr 1", tone: "", kind: "dokument" },
      { when: "05.12.2025", title: "Termin po zmianie (+36 dni)", tone: "orange", kind: "obliczenie" },
    ],
    pkg: [
      { name: "Ogłoszenie o zamówieniu (BZP)", status: "found" },
      { name: "SWZ", status: "found" },
      { name: "PFU / OPZ", status: "missing" },
      { name: "PPU / SWU", status: "found" },
      { name: "Podpisana umowa z wykonawcą", status: "sub" },
      { name: "Protokół konieczności", status: "found" },
      { name: "Aneks do umowy", status: "expected" },
      { name: "Ogłoszenie o zmianie umowy", status: "expected" },
    ],
  },
  "RM-2026-010": {
    short: "Grodzisko Dolne",
    nip: "8161570014",
    kpo: "KPOD.03.15-IW.21-0025/25",
    match: { layer: "L1 · numer KPO", score: 0.98 },
    facts: [
      { t: "Pismo do Urzędu Marszałkowskiego w sprawie terminu", l: "src", s: "skan bez warstwy tekstowej; tekst z transkrypcji, pewność ×0,6", doc: "grodzisko", p: 1 },
      { t: "NIP w piśmie 8161571014 nie przechodzi sumy kontrolnej", l: "calc", rule: "Q01", s: "NIP w xlsx 8161570014 przechodzi; możliwy błąd odczytu skanu; konflikt przekazany ekspertowi" },
      { t: "Przyczyna: dokumentacja projektowa sprzed kilkunastu lat", l: "src", risk: "R02", doc: "grodzisko", p: 1, q: "…dokumentacja projektowa sporządzona przed kilkunastoma laty…" },
      { t: "Przyczyna: uzgodnienia z mieszkańcami, zmiany trasy przez nową zabudowę", l: "src", risk: "R03", doc: "grodzisko", p: 1, q: "…konieczność zmiany przebiegu trasy ze względu na nową zabudowę…" },
      { t: "Przyczyna: zmiana regulaminu KPO", l: "src", risk: "R13", doc: "grodzisko", p: 2 },
    ],
    timeline: [
      { when: "2010–2012", title: "Dokumentacja projektowa (wiek > 12 lat)", tone: "orange", kind: "wniosek modelu" },
      { when: "2026", title: "Pismo do UM w sprawie terminu (skan)", tone: "red", kind: "dokument" },
    ],
    pkg: [
      { name: "Ogłoszenie o zamówieniu (BZP)", status: "missing" },
      { name: "SWZ", status: "missing" },
      { name: "PFU / OPZ", status: "missing" },
      { name: "PPU / SWU", status: "missing" },
      { name: "Podpisana umowa z wykonawcą", status: "missing" },
      { name: "Pismo beneficjenta", status: "found" },
      { name: "Aneks do umowy", status: "missing" },
      { name: "Ogłoszenie o zmianie umowy", status: "missing" },
    ],
  },
};

/** Dokumenty testowe. Fragment w [[…]] jest podświetlany w podglądzie. */
export const DOCS: Record<DocKey, SourceDocument> = {
  zagrodno: {
    name: "Risk_Miner_protokol_koniecznosci_aneksowania_zagrodno.pdf",
    type: "PDF z warstwą tekstową",
    pages: 2,
    sha: "9f3c…e41a",
    title: "PROTOKÓŁ KONIECZNOŚCI ANEKSOWANIA",
    body: [
      "sporządzony w dniu 05.05.2026 r. w Zagrodnie",
      "Dotyczy: zadania „Budowa kanalizacji sanitarnej na terenie Gminy Zagrodno” realizowanego w ramach KPO, w związku z realizacją umowy nr IR.271.1.2026 z dnia 05.03.2026 r.",
      "Komisja w składzie przedstawicieli Zamawiającego, Wykonawcy i Inspektora Nadzoru stwierdza, co następuje: w trakcie prowadzenia robót [[stwierdzono kolizję projektowanego kanału z istniejącą siecią wodociągową]], nieujawnioną na mapie do celów projektowych. Ponadto w rejonie przepompowni PM2 wystąpił wysoki poziom wód gruntowych wymagający dodatkowego odwodnienia wykopu.",
      "Wobec powyższego strony uznają konieczność wydłużenia terminu realizacji o 1 miesiąc.",
    ],
  },
  zlawies: {
    name: "Risk_Miner_protokol_koniecznosci_zlawies.docx",
    type: "DOCX",
    pages: 1,
    sha: "51ab…07c2",
    title: "PROTOKÓŁ KONIECZNOŚCI NR 1",
    body: [
      "Dotyczy: Budowa sieci kanalizacji sanitarnej w miejscowości Zławieś Wielka.",
      "W związku z koniecznością wymiany złóż filtracyjnych na stacji uzdatniania wody strony ustalają [[przedłużenie terminu wykonania zamówienia o 36 dni]] oraz wykonanie robót dodatkowych. Wartość robót dodatkowych wynosi 151 481,54 zł brutto.",
      "Podstawa: art. 455 ust. 1 pkt 3 ustawy Pzp.",
    ],
  },
  grodzisko: {
    name: "Risk_Miner_pismo_termin_grodzisko.pdf",
    type: "Skan bez tekstu · transkrypcja (pewność 0,6)",
    pages: 2,
    sha: "c7d2…9b10",
    title: "Do Urzędu Marszałkowskiego Województwa Podkarpackiego",
    body: [
      "NIP: [[8161571014]]",
      "Gmina Grodzisko Dolne informuje, że dokumentacja projektowa sporządzona przed kilkunastoma laty wymagała aktualizacji, a uzgodnienia z mieszkańcami oraz konieczność zmiany przebiegu trasy ze względu na nową zabudowę wpłynęły na termin realizacji.",
    ],
  },
  xlsx: {
    name: "Risk_Miner_dane_projekty.xlsx",
    type: "Arkusz organizatora · 22 rekordy",
    pages: 1,
    sha: "2e90…aa31",
    title: "Projekty — wiersz 3 (RM-2026-002)",
    body: [
      "Nazwa przedsięwzięcia: Budowa kanalizacji sanitarnej na terenie Gminy Zagrodno…",
      "Opis: …ścieki odprowadzane będą do [[oczyszczalni ścieków realizowanej obecnie]] przez Gminę…",
    ],
  },
};

/** Możliwe korekty finansowe: szacunek wg taryfikatora, do weryfikacji przez opiekuna umowy. */
export const KOR: Record<string, Correction> = {
  "RM-2026-005": { p: "25%", k: "37 870 zł", b: "zmiana umowy niezgodna z art. 455 Pzp (podana podstawa nie pasuje do uzasadnienia)", w: "od wartości zmiany 151 481,54 zł" },
  "RM-2026-002": { p: "do 25%", k: "do 61 200 zł", b: "jeśli aneks podpisano po upływie terminu wykonania, zmiana jest niedozwolona", w: "od wartości zmiany 244 800 zł" },
  "RM-2026-010": { p: "nie dotyczy", k: "—", b: "konflikt danych (NIP), a nie naruszenie przepisów", w: "" },
};
