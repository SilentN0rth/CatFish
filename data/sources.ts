import type { DataSource, SourceClass, SourceGroup, SourceState, Tone } from "@/lib/types";

export const SOURCE_GROUPS: { k: SourceGroup; n: string }[] = [
  { k: "mf", n: "Ministerstwo i fundusze" },
  { k: "pz", n: "Przetargi i umowy" },
  { k: "ts", n: "Teren i środowisko" },
  { k: "wk", n: "Branża wod-kan" },
];

export const SOURCE_CLASS: Record<SourceClass, { label: string; tone: Tone }> = {
  pub: { label: "publiczne", tone: "" },
  tp: { label: "tajemnica przedsiębiorstwa", tone: "amber" },
  os: { label: "dane osobowe", tone: "amber" },
  ik: { label: "infrastruktura krytyczna", tone: "red" },
  wew: { label: "wewnętrzne MFiPR", tone: "amber" },
};

export const SOURCE_STATE: Record<SourceState, { label: string; tone: Tone }> = {
  ok: { label: "połączone", tone: "green" },
  aut: { label: "wymaga uprawnień", tone: "amber" },
  wn: { label: "na wniosek", tone: "amber" },
  todo: { label: "do podłączenia", tone: "" },
};

type Row = [SourceGroup, string, string, SourceClass, string, string, string, SourceState];

/* [grupa, nazwa, co daje dla wod-kan, klasa, dostęp, pobrano, rekordy, stan] — liczby i daty są przykładowe */
const ROWS: Row[] = [
  ["mf", "Lista projektów FE 2021–2027", "wartość, daty, beneficjent i stan każdego projektu wod-kan", "pub", "plik xlsx, aktualizacja co miesiąc", "01.11.2026", "1 284 projekty wod-kan", "ok"],
  ["mf", "Lista projektów KPO (inwestycje A1.x, B3.x)", "projekty wod-kan z KPO, kamienie milowe i terminy", "pub", "plik xlsx na kpo.gov.pl", "15.11.2026", "412 projektów", "ok"],
  ["mf", "Mapa Dotacji UE", "lokalizacja projektów 2014–2020 i 2021–2027, historia gminy", "pub", "API publiczne", "21.11.2026", "3 906 projektów wod-kan", "ok"],
  ["mf", "CST2021 / SL2021", "wnioski o płatność, harmonogramy, aneksy do umów o dofinansowanie", "wew", "konto w systemie, rola opiekuna umowy", "21.11.2026", "18 projektów z portfela", "aut"],
  ["mf", "Wyniki kontroli IZ i IP", "ustalenia z kontroli na miejscu i kontroli zamówień", "wew", "eksport z SL2021 / rejestr kontroli", "20.11.2026", "57 kontroli, 23 z ustaleniami", "aut"],
  ["mf", "Audyty Instytucji Audytowej (KAS)", "ustalenia audytu operacji i systemu, nałożone korekty", "wew", "raporty przekazywane do IZ", "12.11.2026", "9 raportów", "wn"],
  ["mf", "Rejestr nieprawidłowości i korekt", "wcześniejsze korekty u beneficjenta i ich podstawa", "wew", "SL2021 / IMS", "20.11.2026", "31 nieprawidłowości", "aut"],
  ["mf", "Wytyczne MFiPR i taryfikator korekt", "zasady kwalifikowalności i stawki korekt za błędy w zamówieniach", "pub", "dokumenty na funduszeeuropejskie.gov.pl", "18.11.2026", "4 dokumenty, 48 pozycji taryfikatora", "ok"],
  ["pz", "e-Zamówienia / BZP", "ogłoszenia o zamówieniu, wyniku i zmianie umowy", "pub", "API ogłoszeń", "21.11.2026", "2 418 ogłoszeń wod-kan", "ok"],
  ["pz", "Baza Konkurencyjności", "zamówienia poniżej progów Pzp w projektach unijnych", "pub", "API publiczne", "21.11.2026", "366 ogłoszeń", "ok"],
  ["pz", "TED (zamówienia unijne)", "duże przetargi powyżej progów UE", "pub", "API TED", "21.11.2026", "74 ogłoszenia", "ok"],
  ["pz", "Orzeczenia KIO", "spory w przetargach na sieci wod-kan", "pub", "wyszukiwarka orzeczeń", "19.11.2026", "41 orzeczeń", "todo"],
  ["pz", "Dokumenty beneficjenta (aneksy, protokoły)", "faktyczne zmiany terminu i wartości, przyczyny", "tp", "skrzynka podawcza i katalog projektu", "21.11.2026", "146 dokumentów", "ok"],
  ["ts", "Geoportal: EGiB, BDOT10k, NMT, KIEG", "działki, władanie, zabudowa, rzeźba terenu", "os", "WMS/WFS GUGiK; dane o właścicielach na wniosek", "21.11.2026", "6 warstw", "ok"],
  ["ts", "GESUT / KIUT", "istniejące sieci i kolizje na trasie", "ik", "na wniosek do starosty (art. 24 ust. 5 Pgik)", "14.11.2026", "3 powiaty", "wn"],
  ["ts", "GDOŚ: Natura 2000 i formy ochrony", "obszary chronione na trasie", "pub", "WMS / pliki SHP", "21.11.2026", "1 001 obszarów", "ok"],
  ["ts", "ISOK: mapy zagrożenia powodziowego", "strefy Q1% i Q10% wzdłuż trasy", "pub", "WMS Wody Polskie", "21.11.2026", "strefy dla 3 województw", "ok"],
  ["ts", "IMGW-PIB: dane klimatyczne i synoptyczne", "dni z mrozem, opadem, pokrywą śnieżną; weryfikacja aneksów pogodowych", "pub", "dane publiczne IMGW", "21.11.2026", "62 stacje, 10 lat", "ok"],
  ["ts", "PIG-PIB: geologia i wody podziemne", "grunty, poziom wód gruntowych, odwodnienie wykopów", "pub", "WMS i bazy PIG-PIB", "20.11.2026", "8 warstw", "ok"],
  ["ts", "NID: rejestr zabytków i stanowiska archeologiczne", "nadzór archeologiczny na trasie", "pub", "WMS NID", "20.11.2026", "2 warstwy", "ok"],
  ["ts", "GDDKiA i PKP PLK", "przejścia pod drogami krajowymi i torami, uzgodnienia zarządcy", "pub", "mapy sieci i wnioski do zarządcy", "17.11.2026", "2 zarządców", "todo"],
  ["wk", "KPOŚK i sprawozdania z realizacji", "aglomeracje, RLM, długość sieci do wybudowania", "pub", "Wody Polskie, pliki aktualizacji", "10.11.2026", "1 456 aglomeracji", "ok"],
  ["wk", "Wody Polskie: pozwolenia wodnoprawne", "czy pozwolenie jest i kiedy wygasa", "pub", "rejestr pozwoleń, część na wniosek", "18.11.2026", "212 pozwoleń w gminach portfela", "wn"],
  ["wk", "Wody Polskie: taryfy za wodę i ścieki", "cena wody i ścieków u operatora, trwałość projektu", "pub", "decyzje taryfowe w BIP", "16.11.2026", "98 taryf", "ok"],
  ["wk", "MPHP: sieć rzeczna", "cieki i przekroczenia na trasie", "pub", "WMS / SHP KZGW", "21.11.2026", "pełna sieć rzeczna", "ok"],
  ["wk", "GUS BDL: infrastruktura komunalna", "długość sieci, przyłącza i tempo budowy w gminie", "pub", "API BDL", "21.11.2026", "2 477 gmin", "ok"],
  ["wk", "Dane operatora sieci (inspekcje TV, awarie, azbest)", "stan istniejącej sieci, rury azbestowo-cementowe", "ik", "na wniosek do przedsiębiorstwa wod-kan", "—", "—", "wn"],
  ["wk", "Cenniki: Sekocenbud, KNR 2-18", "koszt km sieci wg średnicy i metody", "tp", "licencja płatna", "—", "—", "todo"],
];

export const SOURCES: DataSource[] = ROWS.map(([group, name, gives, cls, access, pulled, records, state]) => ({
  group, name, gives, cls, access, pulled, records, state,
}));
