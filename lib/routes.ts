export const SCREENS = [
  "pulpit",
  "kolejka",
  "nowa",
  "analiza",
  "teren",
  "projekt",
  "beneficjent",
  "zrodla",
  "zbieranie",
  "jakosc",
  "sloty",
  "monitoring",
  "ekspert",
  "kalibracja",
  "raporty",
  "eksport",
] as const;

export type ScreenKey = (typeof SCREENS)[number];

export const TITLES: Record<ScreenKey, string> = {
  pulpit: "Pulpit",
  nowa: "Nowa inwestycja",
  analiza: "Nowa inwestycja · wynik analizy",
  teren: "Teren i warianty trasy",
  projekt: "Projekty",
  zbieranie: "Zbieranie danych",
  jakosc: "Jakość danych",
  sloty: "Sloty danych",
  monitoring: "Monitoring",
  ekspert: "Panel eksperta",
  kalibracja: "Kalibracja",
  eksport: "Eksport i ustawienia",
  zrodla: "Źródła danych",
  kolejka: "Moja praca",
  beneficjent: "Profil beneficjenta",
  raporty: "Raporty",
};

/** Ekrany podrzędne podświetlają w menu swój ekran nadrzędny. */
export const NAVMAP: Partial<Record<ScreenKey, ScreenKey>> = { analiza: "nowa", beneficjent: "projekt" };

export const isScreen = (s: string): s is ScreenKey => (SCREENS as readonly string[]).includes(s);
