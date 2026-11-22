import type { Finding, FindingLevel, Slot, Tone } from "@/lib/types";

export const FINDINGS: Finding[] = [
  { rule: "Q01", project: "RM-2026-010", title: "Suma kontrolna NIP", text: "NIP 8161571014 w piśmie nie przechodzi sumy kontrolnej; w xlsx 8161570014 przechodzi. Wartość ze skanu – możliwy błąd odczytu.", level: "prawdopodobny", doc: "grodzisko" },
  { rule: "Q02", project: "RM-2026-010", title: "Suma kontrolna REGON", text: "REGON w piśmie nie przechodzi sumy kontrolnej (skan, pewność ×0,6).", level: "prawdopodobny", doc: "grodzisko" },
  { rule: "Q07", project: "RM-2026-002", title: "Zmiana w dniu upływu terminu", text: "Protokół konieczności z 05.05.2026 sporządzono w dniu końca umowy.", level: "do weryfikacji", doc: "zagrodno" },
  { rule: "Q09", project: "RM-2026-002", title: "Brak podstawy z art. 455 Pzp", text: "Protokół nie wskazuje podstawy zmiany. Ocena należy do opiekuna umowy.", level: "do weryfikacji", doc: "zagrodno" },
  { rule: "Q10", project: "RM-2026-005", title: "Mieszanie podstaw art. 455", text: "Powołano ust. 1 pkt 3, a uzasadnienie opisuje okoliczności z pkt 4.", level: "do weryfikacji", doc: "zlawies" },
  { rule: "Q11", project: "RM-2026-005", title: "Oczekiwane ogłoszenie o zmianie umowy", text: "Dla pkt 3 oczekiwane ogłoszenie o zmianie. Nie znaleziono w przeanalizowanych źródłach.", level: "do weryfikacji", doc: null },
  { rule: "Q16", project: "RM-2026-016", title: "Suma długości (m / km)", text: "W nazwie 22,616 km sieci wodociągowej; suma odcinków w opisie 22 616 m – zgodne po przeliczeniu.", level: "informacja", doc: null },
  { rule: "Q14", project: "RM-2026-020", title: "Konflikt podsektora nazwa ↔ opis", text: "Nazwa: kanalizacja z oczyszczalnią; rekord poza zakresem sieci liniowych.", level: "pewny", doc: null },
  { rule: "Q18", project: "RM-2026-010", title: "Skan bez warstwy tekstowej", text: "Tekst z transkrypcji oznaczonej jawnie; pewność wartości ×0,6.", level: "informacja", doc: "grodzisko" },
  { rule: "Q04", project: "RM-2026-012", title: "Kod instytucji KPO ↔ województwo", text: "Rekord BZP – reguła nie dotyczy; brak numeru KPO.", level: "informacja", doc: null },
  { rule: "Q05", project: "RM-2026-008", title: "Kolejność dat", text: "Data zakończenia przed datą ogłoszenia w rekordzie części 1.", level: "pewny", doc: null },
  { rule: "Q21", project: "RM-2026-005", title: "Opóźnienie efektu dłuższe niż wydłużenie", text: "Efekt zależy od SUW; wydłużenie 36 dni nie pokrywa wymiany złóż.", level: "prawdopodobny", doc: "zlawies" },
];

export const LEVELS: Record<FindingLevel, { label: string; tone: Tone }> = {
  pewny: { label: "błąd pewny", tone: "red" },
  prawdopodobny: { label: "błąd prawdopodobny", tone: "orange" },
  "do weryfikacji": { label: "niezgodność do weryfikacji", tone: "amber" },
  informacja: { label: "informacja", tone: "" },
};

export const LEVEL_COUNTS: { k: FindingLevel; n: number }[] = [
  { k: "pewny", n: 13 },
  { k: "prawdopodobny", n: 9 },
  { k: "do weryfikacji", n: 11 },
  { k: "informacja", n: 3 },
];

export const SLOTS: Slot[] = [
  { k: "egib", group: "Geodezja", name: "EGiB – działki i władanie", filled: 3, total: 4, file: "plik GML · v2" },
  { k: "gesut", group: "Geodezja", name: "GESUT / KIUT – uzbrojenie", filled: 0, total: 5, file: "pusty" },
  { k: "bdot", group: "Geodezja", name: "BDOT10k / NMT", filled: 4, total: 5, file: "pola · v1" },
  { k: "srod", group: "Środowisko i woda", name: "Natura 2000, decyzja środowiskowa, pozwolenie wodnoprawne", filled: 2, total: 4, file: "pola · v1" },
  { k: "wniosek", group: "Wniosek o dofinansowanie", name: "Wniosek i umowa o objęcie wsparciem", filled: 6, total: 7, file: "PDF · v3" },
  { k: "benef", group: "Dokumenty beneficjenta", name: "Projekt, pozwolenia, warunki OSD", filled: 2, total: 3, file: "DOCX · v1" },
  { k: "zam", group: "Postępowanie i umowa", name: "SWZ, PFU/OPZ, PPU, umowa", filled: 1, total: 4, file: "PDF · v1" },
  { k: "real", group: "Realizacja i odbiór", name: "Próby ciśnieniowe, inspekcja TV, odbiory", filled: 0, total: 3, file: "pusty" },
  { k: "ekspl", group: "Operator i eksploatacja", name: "Zapas SUW, oczyszczalnia, infiltracja", filled: 1, total: 3, file: "pola · v1" },
];

/** 32 elementy niszowe wod-kan, o które warto zapytać, ze stanem (indeks w NICHE_STATES). */
export const NICHE: { n: string; s: 0 | 1 | 2 | 3 }[] = (
  [
    ["Rury azbestowo-cementowe w czynnej sieci", 0], ["Zapas wydajności SUW", 3], ["Przepustowość oczyszczalni", 3], ["Infiltracja wód przypadkowych", 3],
    ["Warunki OSD dla przepompowni", 2], ["Pozwolenie wodnoprawne", 3], ["Decyzja o środowiskowych uwarunkowaniach", 1], ["Okno lęgowe IV–VII", 0],
    ["Tytuł prawny do gruntu", 0], ["Decyzje art. 124 ugn", 2], ["Służebności przesyłu", 3], ["Skrzyżowania z gazociągami", 3],
    ["Skrzyżowania z liniami energetycznymi", 3], ["Skrzyżowania z telekomunikacją", 3], ["Przejście pod torami – zarządca", 0], ["Przejście pod drogą wojewódzką – ZDW", 3],
    ["Próba ciśnieniowa", 3], ["Inspekcja TV kanałów", 3], ["Wiek dokumentacji projektowej", 1], ["Waloryzacja wynagrodzenia", 3],
    ["Koniec kwalifikowalności wydatków", 0], ["Wskaźnik przyłączonych nieruchomości", 0], ["RLM aglomeracji", 0], ["Ujęcie w KPOŚK", 0],
    ["Odwodnienie wykopów", 1], ["Nadzór archeologiczny", 3], ["Wycinka drzew", 3], ["Materiał rur (PE / PVC / kamionka)", 1],
    ["Głębokość posadowienia", 0], ["Zasilanie awaryjne przepompowni", 3], ["Studnie rewizyjne i spadki", 3], ["Odtworzenie nawierzchni", 3],
  ] as [string, 0 | 1 | 2 | 3][]
).map(([n, s]) => ({ n, s }));

export const NICHE_STATES: { label: string; color: string }[] = [
  { label: "wypełnione w slocie", color: "var(--green)" },
  { label: "znaleziono w materiale z dowodem", color: "var(--blue)" },
  { label: "plik w slocie (nieparsowany)", color: "var(--amber)" },
  { label: "slot pusty – nie znaleziono w przeanalizowanych źródłach", color: "var(--line)" },
];

export const SECTOR_RULES: { code: string; text: string; color: string }[] = [
  { code: "SL09", text: "Tytuł do gruntu: zgody 21 z 64 działek prywatnych", color: "var(--orange)" },
  { code: "SL06", text: "Pozwolenie wodnoprawne: brak przy 2 przekroczeniach cieków", color: "var(--red)" },
  { code: "SL13", text: "Wiek dokumentacji: nie znaleziono w przeanalizowanych źródłach", color: "var(--amber)" },
  { code: "SL07", text: "Kwalifikowalność: zapas 16 dni", color: "var(--red)" },
];

export const AGREEMENTS: { t: string; done: boolean }[] = [
  { t: "Regionalna Dyrekcja Ochrony Środowiska – Natura 2000", done: false },
  { t: "Wody Polskie – pozwolenie wodnoprawne (potok)", done: false },
  { t: "Zarządca drogi wojewódzkiej – przejście i zajęcie pasa", done: true },
  { t: "Zarządca infrastruktury kolejowej – przewiert pod torami", done: false },
  { t: "Operator systemu dystrybucyjnego – zasilanie przepompowni", done: true },
  { t: "Gestorzy sieci gazowej i telekomunikacyjnej", done: true },
  { t: "Konserwator zabytków – nadzór archeologiczny", done: false },
  { t: "Właściciele działek prywatnych – zgody (21 / 64)", done: false },
];
