import type { GciDimension, HistoryEntry, NewInvestmentForm, QueueItem, Risk } from "@/lib/types";

/* GCI: 6 wymiarów; wagi startowe z pakietu sektorowego wod-kan v1.3 (założenie eksperckie, nie kalibracja) */
export const DIM0: GciDimension[] = [
  { k: "kol", n: "Kolizje z uzbrojeniem i zabudową", ly: "BDOT10k · GESUT", v: 0.72, w: 0.22, cov: "warstwa", r: "R03" },
  { k: "grunt", n: "Grunty i prawa do nieruchomości", ly: "EGiB (działki, władanie)", v: 0.58, w: 0.16, cov: "slot", r: "R03" },
  { k: "srod", n: "Środowisko i przekroczenia cieków", ly: "GDOŚ Natura 2000 · MPHP", v: 0.64, w: 0.2, cov: "warstwa", r: "R04" },
  { k: "woda", n: "Wody gruntowe i tereny podmokłe", ly: "BDOT10k · mapa hydrogeologiczna", v: 0.81, w: 0.14, cov: "opis", r: "R02" },
  { k: "morf", n: "Morfologia i głębokość posadowienia", ly: "NMT · pompownie", v: 0.45, w: 0.1, cov: "opis", r: "R02 · R14" },
  { k: "stan", n: "Stan istniejący i wiek dokumentacji", ly: "rodzaj prac · dokumenty projektu", v: 0.38, w: 0.18, cov: "brak", r: "R02" },
];

/** Ryzyka nowej inwestycji Brzozowa – Lipnik (sygnał → zdarzenie → wpływ → środki zaradcze). */
export const RISKS: Risk[] = [
  { r: "R04", n: "Zgody i uzgodnienia, które zależą od innych instytucji", lvl: "wysokie", sig: "Trasa przecina obszar Natura 2000 na ok. 420 m i potok Brzozówka.", ev: "Przedłużające się uzgodnienia z RDOŚ i Wodami Polskimi (pozwolenie wodnoprawne).", im: "Opóźnienie ogłoszenia przetargu o 3–6 mies.; okno lęgowe IV–VII ogranicza roboty.", mt: "Wystąpić o uzgodnienia przed SWZ; rozważyć wariant B omijający obszar; przewiert HDD pod ciekiem.", c: [0.9, 0.82, 0.74], src: "Warstwa GDOŚ (WMS) · opis inwestycji", lay: "calc" },
  { r: "R03", n: "Kolizje z innymi sieciami i dostęp do działek", lvl: "wysokie", sig: "64 działki prywatne na trasie (EGiB); 11 skrzyżowań z wodociągiem i gazociągiem.", ev: "Kolizja nieujawniona na mapie do celów projektowych, brak zgód właścicieli.", im: "Roboty dodatkowe i wydłużenie terminu – jak w Zagrodnie (+1 mies.).", mt: "Aktualizacja mapy do celów projektowych, inwentaryzacja GESUT/KIUT, zgody i decyzje art. 124 ugn przed przetargiem.", c: [0.84, 0.76, 0.81], src: "Slot EGiB (plik GML, wersja 2) · podobny projekt RM-2026-002", lay: "calc" },
  { r: "R02", n: "Słabo rozpoznany stan istniejącej sieci", lvl: "średnie", sig: "Tereny podmokłe przy przepompowni PS2; wody gruntowe ok. 1,2 m p.p.t. (z opisu).", ev: "Konieczność odwodnienia wykopów, zmiana technologii posadowienia pompowni.", im: "Koszt odwodnienia i zmiana harmonogramu przy PS2.", mt: "Badania geotechniczne w rejonie PS2; pozycja odwodnienia w przedmiarze; zapis w PPU o ryzyku gruntowym.", c: [0.62, 0.7, 0.66], src: "Opis inwestycji (ekstrakcja regułowa) · BDOT10k", lay: "model" },
  { r: "R06", n: "Zbyt napięty harmonogram", lvl: "średnie", sig: "21 dni/km wobec mediany 31 dni/km w bazie; zapas do końca kwalifikowalności 16 dni.", ev: "Niezakończenie robót przed 31.08.2026.", im: "Ryzyko utraty kwalifikowalności części wydatków KPO.", mt: "Urealnić harmonogram; podział na 2 części zamówienia; kamienie milowe z karami umownymi.", c: [0.88, 0.6, 0.72], src: "Obliczenie z bazy (n = 4) · daty z formularza", lay: "calc" },
];

export const SIMILAR: { id: string; name: string; score: number; why: string }[] = [
  { id: "RM-2026-002", name: "Zagrodno", score: 0.86, why: "ten sam podsektor i rodzaj prac, pompownie, zależność od oczyszczalni" },
  { id: "RM-2026-010", name: "Grodzisko Dolne", score: 0.79, why: "kanalizacja sanitarna, zmiany trasy przez zabudowę" },
  { id: "RM-2026-005", name: "Zławieś Wielka", score: 0.71, why: "kanalizacja sanitarna; zdarzenie dotyczy SUW" },
  { id: "RM-2026-017", name: "Kleszczewo", score: 0.66, why: "sieć z przyłączami, podobna długość" },
];

export const RECOMMENDATIONS: string[] = [
  "Przed ogłoszeniem przetargu uzyskać uzgodnienia RDOŚ i pozwolenie wodnoprawne dla przekroczenia potoku.",
  "Porównać wariant B trasy (GCI 47, bez Natura 2000, +0,6 km, 1 pompownia więcej).",
  "Zaktualizować mapę do celów projektowych i inwentaryzację GESUT/KIUT; uzyskać zgody właścicieli 64 działek.",
  "Urealnić harmonogram do mediany 31 dni/km lub podzielić zamówienie na 2 części.",
  "W PPU uregulować ryzyko gruntowe przy PS2 i rozliczenie odwodnienia.",
];

export const INITIAL_FORM: NewInvestmentForm = {
  ps: "Kanalizacja sanitarna",
  rp: "Budowa / rozbudowa",
  met: ["Wykop otwarty", "Przewiert sterowany (HDD)"],
  kan: "Grawitacyjno-tłoczna",
  cieki: 2,
  drogi: 3,
  tory: 1,
  pomp: 2,
  przyl: 146,
  km: 7.8,
  kposk: "tak",
};

export const METHODS = ["Wykop otwarty", "Przewiert sterowany (HDD)", "Przecisk", "Mikrotunelowanie", "Relining / renowacja bezwykopowa"];

export const DEFAULT_DESCRIPTION =
  "Budowa sieci kanalizacji sanitarnej grawitacyjno-tłocznej w miejscowościach Brzozowa i Lipnik – ok. 7,8 km sieci, 2 przepompownie, 146 przyłączy. Trasa przecina potok Brzozówka i drogę wojewódzką, odcinek końcowy biegnie wzdłuż linii kolejowej do oczyszczalni. Aglomeracja ujęta w KPOŚK. Planowany start robót: marzec 2026.";

export const INITIAL_QUEUE: QueueItem[] = [
  { id: "W-118", p: "RM-2026-002", t: "Zależność od oczyszczalni opóźni efekt ekologiczny o ok. 4 miesiące (R06, R15).", l: "model", c: 0.71, st: "oczekuje" },
  { id: "W-117", p: "RM-2026-005", t: "Zdarzenie dotyczy SUW (podsektor dodatkowy) – nie wliczać do statystyk sieci kanalizacyjnej.", l: "model", c: 0.64, st: "oczekuje" },
  { id: "W-116", p: "RM-2026-010", t: "Konflikt NIP: przyjąć 8161570014 z xlsx; wartość ze skanu uznać za błąd odczytu.", l: "calc", c: 0.88, st: "oczekuje" },
  { id: "W-115", p: "RM-2026-005", t: "Oczekiwane ogłoszenie o zmianie umowy (art. 455 ust. 1 pkt 3) – nie znaleziono w przeanalizowanych źródłach.", l: "calc", c: 0.82, st: "oczekuje" },
  { id: "W-114", p: "RM-2026-002", t: "Protokół sporządzony w dniu upływu terminu – sygnał późnego zgłoszenia zmiany.", l: "calc", c: 0.93, st: "oczekuje" },
  { id: "W-113", p: "Nowa inwestycja", t: "Przekroczenie potoku w obszarze Natura 2000 wymaga uzgodnień z RDOŚ i Wodami Polskimi przed ogłoszeniem przetargu.", l: "model", c: 0.77, st: "oczekuje" },
  { id: "W-112", p: "RM-2026-010", t: "Dokumentacja sprzed ponad 12 lat – rekomendacja aktualizacji mapy do celów projektowych.", l: "model", c: 0.69, st: "oczekuje" },
];

export const INITIAL_HISTORY: HistoryEntry[] = [
  { d: "21.11.2026 22:14", who: "Ekspert sektorowy", w: "W-109", dec: "zatwierdzony", why: "Zgodne z protokołem, s. 1.", v: "wod-kan v1.3" },
  { d: "21.11.2026 21:58", who: "Ekspert sektorowy", w: "W-108", dec: "poprawiony", why: "Zmieniono poziom R04 z wysokiego na średni – decyzja RDOŚ już wydana (dokument beneficjenta).", v: "wod-kan v1.3" },
  { d: "21.11.2026 21:40", who: "Opiekun umowy", w: "W-107", dec: "odrzucony", why: "Kwota dotyczy innej części zamówienia.", v: "wod-kan v1.2" },
  { d: "20.11.2026 16:05", who: "Ekspert sektorowy", w: "Wagi GCI", dec: "nowa wersja", why: "Waga „Środowisko i cieki” 0,16 → 0,20 po przeglądzie projektów z Natura 2000.", v: "wod-kan v1.3" },
];

/** Katalog ryzyk R01–R15 z liczbą sygnałów w pakiecie wod-kan. */
export const RISK_CATALOG: { name: string; signals: number }[] = [
  ["Niepełny lub niespójny zakres", 4],
  ["Słabo rozpoznany stan istniejącej sieci", 7],
  ["Kolizje z innymi sieciami i dostęp do działek", 9],
  ["Decyzje, pozwolenia i uzgodnienia zależne od podmiotów trzecich", 6],
  ["Niejasny lub nieadekwatny podział odpowiedzialności", 3],
  ["Zbyt napięty harmonogram", 5],
  ["Nieprzewidziane zmiany i roboty dodatkowe", 6],
  ["Model wynagrodzenia niedopasowany do niepewności zakresu", 2],
  ["Niejednoznaczne lub niemierzalne wymagania techniczne", 3],
  ["Niedookreślone próby, rozruch i odbiór", 4],
  ["Postępowanie podatne na odwołanie lub ograniczenie konkurencji", 3],
  ["Niewystarczająca zdolność wykonawcy lub łańcucha dostaw", 2],
  ["Ryzyko finansowania, budżetu i płatności", 4],
  ["Nadmierne koszty eksploatacji i utrzymania", 3],
  ["Nieosiągnięcie efektu technologicznego, użytkowego lub środowiskowego", 5],
].map(([name, signals]) => ({ name: name as string, signals: signals as number }));

/** Pytania do adresatów pakietu zapytań. */
export const ADDRESSEES: { to: string; text: string }[] = [
  { to: "Beneficjent – Gmina", text: "Prosimy o przekazanie: aktualnej mapy do celów projektowych, inwentaryzacji GESUT/KIUT, wykazu zgód właścicieli (21 z 64), informacji o wieku dokumentacji projektowej oraz harmonogramu rzeczowo-finansowego z podziałem na odcinki." },
  { to: "RDOŚ (przez beneficjenta)", text: "Prosimy o informację o stanie uzgodnień dla odcinka w obszarze Natura 2000 (ok. 420 m) i o ograniczeniach terminowych robót (okres lęgowy)." },
  { to: "Wody Polskie (przez beneficjenta)", text: "Prosimy o informację, czy wystąpiono o pozwolenie wodnoprawne na przekroczenie potoku Brzozówka i odwodnienie wykopów przy PS2." },
  { to: "Operator / spółka wodna", text: "Prosimy o dane o przepustowości oczyszczalni i udziale wód przypadkowych (infiltracja) w zlewni." },
];
