# GeoWATER Risk – prototyp (Next.js)

Klikalny prototyp narzędzia **GeoWATER Risk** (Risk Miner, sieci wod-kan) dla urzędnika MFiPR, przepisany z jednego pliku HTML na **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Motion (motion.dev)**.

Wszystkie ekrany, teksty i kliknięcia z wersji HTML są zachowane. Styl: biel i czerń, kolor tylko dla poziomu ryzyka, flag stop i potwierdzeń. Działa w trybie jasnym i ciemnym oraz na telefonie.

> Dane są testowe: 12 projektów z pliku organizatora, 3 dokumenty (Zagrodno, Zławieś Wielka, Grodzisko Dolne) i przykładowe wartości dla źródeł, pogody i kalibracji. Narzędzie nie ocenia zgodności z prawem i nie wydaje decyzji administracyjnych.

## Jak uruchomić

Wymagany Node.js 20.9 lub nowszy.

```bash
npm install
npm run dev        # http://localhost:3000 (przekierowuje na /pulpit)
```

Wersja produkcyjna:

```bash
npm run build
npm start
```

Sprawdzenie typów: `npm run typecheck`.

## Ekrany

| Adres | Ekran |
| --- | --- |
| `/pulpit` | Portfel inwestycji, ostrzeżenia, rozkład GCI, tabela projektów |
| `/kolejka` | Moja praca – zadania z priorytetem i przejściem do miejsca załatwienia |
| `/nowa` | Formularz nowej inwestycji (opis, podsektor, rodzaj prac, metody, przejścia) |
| `/analiza` | Wynik analizy: GCI z suwakami wag, flagi stop, ryzyka sygnał → zdarzenie → wpływ → środki, podobne projekty, harmonogram, pogoda, rekomendacje |
| `/teren` | Mapa poglądowa z warstwami, warianty trasy A/B, punkty zapalne, GCI odcinków |
| `/projekt` | Karta projektu: ustalenia ze źródłem i stroną, oś czasu, pakiet dokumentów |
| `/beneficjent` | Profil beneficjenta: historia projektów, kontrole, korekty |
| `/zrodla` | 28 źródeł danych z klasą wrażliwości i stanem podłączenia |
| `/zbieranie` | Import xlsx, pobieranie z BZP dla jednego projektu, łączenie dokumentów |
| `/jakosc` | Znaleziska jakości danych z regułami, potwierdzanie i odrzucanie |
| `/sloty` | Sloty danych zespołu, 32 elementy niszowe, reguły branżowe, uzgodnienia |
| `/monitoring` | Skan zmian, reguła W01 (pogoda a dane IMGW), diff rekordu, ostrzeżenia |
| `/ekspert` | Panel eksperta: kolejka wniosków, historia decyzji, wagi GCI, katalog ryzyk, pakiety |
| `/kalibracja` | Progi, wagi ekspertów, pewność, reguły i alarmy, normy, podobieństwo |
| `/raporty` | Raport dla Komitetu Monitorującego i ślad audytowy |
| `/eksport` | Eksport JSON/CSV (z pobraniem pliku), wybór modelu językowego, co działa |

Nakładki: karta ryzyka, notatka służbowa, podgląd dokumentu z podświetlonym fragmentem, pakiet zapytań, poprawka wniosku, wyszukiwarka (⌘K / Ctrl+K), postęp analizy. Esc zamyka nakładkę.

## Struktura

```
app/
  layout.tsx            czcionki Geist, MotionConfig, stan aplikacji, powłoka
  [screen]/page.tsx     jeden typowany adres na ekran (generateStaticParams)
  globals.css           Tailwind 4 + tokeny kolorów + style komponentów
components/
  shell/AppShell.tsx    pasek boczny, górny pasek, toast, skróty klawiszowe
  screens/*.tsx         16 ekranów + registry.tsx (mapa adres → komponent)
  overlays/*.tsx        7 nakładek, OverlayHost z animacjami Motion
  domain/*.tsx          wspólne bloki: tabela wag GCI, karta ryzyka, pogoda
  map/RouteMap.tsx      mapa SVG z warstwami, odcinkami i punktami zapalnymi
  ui/                   ikony, prymitywy (Chip, Seg, CheckBox, Callout…), Motion (Screen, Kpi, Gauge)
data/*.ts               typowane dane: projekty, dokumenty, ryzyka, źródła, kalibracja, pogoda…
lib/
  types.ts              typy domenowe
  state.tsx             stan aplikacji (React Context) i akcje: nawigacja, decyzje, toast, nakładki
  format.ts             GCI, pasma, kolory, format liczb, CSV
  export.ts             rekordy do eksportu i zapis pliku
  routes.ts             lista ekranów i tytuły
```

Stan jest trzymany w pamięci przeglądarki w obrębie sesji (jak w wersji HTML). Odświeżenie strony przywraca dane startowe.

Tailwind: tokeny projektu są dostępne jako klasy, np. `text-fg-3`, `bg-surface-2`, `border-line`, `text-red`. Style komponentów (`.card`, `.chip`, `.btn`…) siedzą w warstwie `components`, więc klasy Tailwinda zawsze je nadpisują.

Motion: wejście ekranów (kaskada sekcji), wjazd arkuszy i okien, toast, licznik KPI, łuk GCI, słupki wykresów, przełączanie zakładek, lista zadań i kolejka eksperta. Animacje respektują ustawienie „ogranicz ruch” w systemie.

## Co działa, a co jest tylko zaprojektowane

Ten projekt to **interfejs z danymi testowymi**. Wszystkie kliknięcia działają: filtry, suwaki wag z przeliczeniem GCI, decyzje eksperta z historią i licznikiem, poprawka z wymaganym uzasadnieniem, fałszywe alarmy zasilające kalibrację, oceny trafności, przełączanie warstw mapy i wariantów, eksport JSON/CSV z pobraniem pliku, kopiowanie notatek.

Symulowane w interfejsie: pobieranie z BZP, skan monitoringu, „Pobierz” przy źródłach, zapis wersji reguł i kalibracji (komunikat bez trwałego zapisu), pobieranie .docx/PDF.

Silnik (import xlsx, ekstrakcja z PDF/DOCX, reguły jakości, klient BZP) jest w osobnym projekcie Python `georisk-miner`. Ten frontend nie jest z nim jeszcze połączony; kolejny krok to podpięcie jego API zamiast plików w `data/`.
