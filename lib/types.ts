/* Typy domenowe prototypu GeoWATER Risk. */

/** Ton etykiety (chip). Kolor tylko dla znaczenia: ryzyko, flaga stop, potwierdzenie. */
export type Tone = "" | "blue" | "green" | "orange" | "red" | "amber";

/** Warstwa wiedzy: dane źródłowe, obliczenie albo wniosek modelu. */
export type Layer = "src" | "calc" | "model";

export type RiskLevel = "wysokie" | "średnie" | "niskie";

export type ProjectStatus = "Zakończony" | "W realizacji" | "Postępowanie";

export interface Project {
  id: string;
  /** Gmina (odbiorca) */
  gm: string;
  woj: string;
  /** Nazwa przedsięwzięcia */
  nm: string;
  /** Podsektor główny */
  ps: string;
  /** Podsektor dodatkowy */
  ps2?: string;
  /** Rodzaj prac */
  rp: string;
  gci: number;
  st: ProjectStatus;
  /** Kody ryzyk z katalogu */
  r: string[];
  /** Identyfikator publiczny (BZP lub numer KPO) */
  pub: string;
  alert?: boolean;
}

export type DocKey = "zagrodno" | "zlawies" | "grodzisko" | "xlsx";

export interface Fact {
  t: string;
  l: Layer;
  s?: string;
  doc?: DocKey;
  p?: number | string;
  q?: string;
  risk?: string;
  rule?: string;
}

export type TimelineTone = "" | "red" | "orange" | "green";

export interface TimelineEvent {
  when: string;
  title: string;
  tone: TimelineTone;
  kind: string;
}

export type PackageStatus = "found" | "missing" | "ref" | "expected" | "sub";

export interface PackageDoc {
  name: string;
  status: PackageStatus;
}

export interface ProjectDetail {
  short: string;
  nip: string;
  kpo: string;
  match: { layer: string; score: number };
  facts: Fact[];
  timeline: TimelineEvent[];
  pkg: PackageDoc[];
}

export interface SourceDocument {
  name: string;
  type: string;
  pages: number;
  sha: string;
  title: string;
  /** Akapity; fragment w [[podwójnych nawiasach]] jest podświetlany. */
  body: string[];
}

export type Coverage = "warstwa" | "slot" | "opis" | "brak";

export interface GciDimension {
  k: string;
  /** Nazwa wymiaru */
  n: string;
  /** Warstwy danych */
  ly: string;
  /** Wartość cechy 0–1 */
  v: number;
  /** Waga */
  w: number;
  cov: Coverage;
  r: string;
}

export interface Risk {
  r: string;
  n: string;
  lvl: RiskLevel;
  sig: string;
  ev: string;
  im: string;
  mt: string;
  /** Jakość źródła, zgodność źródeł, siła wnioskowania */
  c: [number, number, number];
  src: string;
  lay: Layer;
}

export type QueueStatus = "oczekuje" | "zatwierdzony" | "poprawiony" | "odrzucony";

export interface QueueItem {
  id: string;
  p: string;
  t: string;
  l: Layer;
  c: number;
  st: QueueStatus;
  fix?: string;
}

export interface HistoryEntry {
  d: string;
  who: string;
  w: string;
  dec: string;
  why: string;
  v: string;
}

export type FindingLevel = "pewny" | "prawdopodobny" | "do weryfikacji" | "informacja";

export interface Finding {
  rule: string;
  project: string;
  title: string;
  text: string;
  level: FindingLevel;
  doc: DocKey | null;
}

export interface Slot {
  k: string;
  group: string;
  name: string;
  filled: number;
  total: number;
  file: string;
}

export type SourceGroup = "mf" | "pz" | "ts" | "wk";
export type SourceClass = "pub" | "tp" | "os" | "ik" | "wew";
export type SourceState = "ok" | "aut" | "wn" | "todo";

export interface DataSource {
  group: SourceGroup;
  name: string;
  gives: string;
  cls: SourceClass;
  access: string;
  pulled: string;
  records: string;
  state: SourceState;
}

export type TaskWhen = "dzis" | "tydz" | "pozn";
export type TaskPriority = "wysoki" | "średni" | "niski";

export interface Task {
  id: string;
  kiedy: TaskWhen;
  d: string;
  p: string;
  t: string;
  w: string;
  pr: TaskPriority;
  go: string;
}

export interface BeneficiaryProject {
  period: string;
  program: string;
  name: string;
  value: string;
  state: string;
  changes: string;
  corrections: string;
}

export interface BeneficiaryControl {
  year: string;
  by: string;
  kind: string;
  result: string;
}

export interface Beneficiary {
  n: string;
  nip: string;
  woj: string;
  h: BeneficiaryProject[];
  k: BeneficiaryControl[];
}

export interface Correction {
  p: string;
  k: string;
  b: string;
  w: string;
}

export type Variant = "A" | "B";

export interface Route {
  pts: [number, number][];
  gci: number[];
  len: string;
}

export interface HotSpot {
  x: number;
  y: number;
  n: number;
  t: string;
  g: number;
  d: string;
}

export type LayerKey = "orto" | "bdot" | "egib" | "gesut" | "n2k" | "cieki" | "isok" | "hs";

export interface NewInvestmentForm {
  ps: string;
  rp: string;
  met: string[];
  kan: string;
  cieki: number;
  drogi: number;
  tory: number;
  pomp: number;
  przyl: number;
  km: number;
  kposk: string;
}

export type StepKey = "cieki" | "drogi" | "tory" | "pomp" | "przyl";
