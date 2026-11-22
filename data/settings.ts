export type LlmProvider = "none" | "anthropic" | "openai_compatible" | "ollama";

/** Dostawcy modelu językowego i informacja, gdzie przetwarzane są dane. */
export const LLM: Record<LlmProvider, { name: string; where: string; local: boolean }> = {
  none: { name: "Brak modelu (domyślnie)", where: "Ekstrakcja regułowa i deterministyczna. Wszystkie dane przetwarzane lokalnie na komputerze urzędnika.", local: true },
  anthropic: { name: "Anthropic (API)", where: "Fragmenty dokumentów wysyłane do API dostawcy. Sprawdź umowę powierzenia i region przetwarzania.", local: false },
  openai_compatible: { name: "Zgodny z OpenAI (dowolny dostawca)", where: "Dane trafiają do wskazanego endpointu. Region i retencja zależą od dostawcy.", local: false },
  ollama: { name: "Ollama (model lokalny)", where: "Model działa w infrastrukturze MFiPR; dane nie opuszczają sieci resortu.", local: true },
};

export const STATUS_WORKS = [
  "Import xlsx (22 projekty) z klasyfikacją podsektora i rodzaju prac",
  "Ekstrakcja z PDF i DOCX: fakty ze stroną i fragmentem",
  "Łączenie warstwowe z pewnością, konflikty bez nadpisywania",
  "32 reguły jakości, 36 znalezisk na danych testowych",
  "Ryzyka sygnał → zdarzenie → wpływ → środki z 3 składowymi pewności",
  "Monitoring z diff i ostrzeżeniami; panel eksperta z historią",
  "Sloty danych, reguły SL01–SL15, eksport JSON/CSV",
];

export const STATUS_WRITTEN = [
  "Klient BZP (zapytanie po mieście, filtr NIP w kodzie) – nazwy pól do sprawdzenia przy pierwszym uruchomieniu",
  "Mapa Leaflet i warstwy WMS Geoportalu/GDOŚ (wymaga sieci)",
];

export const STATUS_DESIGNED = [
  "Automatyczne liczenie cech GCI z BDOT10k, NMT, EGiB, MPHP, Natura 2000",
  "Hot-spoty wzdłuż trasy i parsowanie GML do pól slotów",
  "OCR skanów (dziś jawna transkrypcja, pewność 0,6)",
  "Wywołania LLM – konfiguracja gotowa, ekstrakcja regułowa",
  "Adaptery TED, KIO, CST2021, BIP",
  "Dane pogodowe IMGW i mapy ISOK – dziś wartości przykładowe, adaptery do podłączenia",
  "Kalibracja na danych: zakładka i wersje działają, przy n < 10 wartości to założenia eksperckie",
];
