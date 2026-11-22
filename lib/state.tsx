"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DIM0, INITIAL_FORM, INITIAL_HISTORY, INITIAL_QUEUE } from "@/data/analysis";
import type { CalibCategory, ExpertWeightsKind } from "@/data/calibration";
import type { LlmProvider } from "@/data/settings";
import { nowPl } from "./format";
import type { ScreenKey } from "./routes";
import type {
  DocKey,
  FindingLevel,
  GciDimension,
  HistoryEntry,
  LayerKey,
  NewInvestmentForm,
  QueueItem,
  QueueStatus,
  SourceGroup,
  TaskWhen,
  Variant,
} from "./types";

export type ExportKind = "ryzyka" | "projekty" | "jakosc" | "decyzje";
export type ExpertTab = "kolejka" | "historia" | "wagi" | "katalog" | "pakiety";

export interface ScanEvent {
  when: string;
  n: number;
}

/** Cały stan prototypu – odpowiednik obiektu S z wersji HTML. */
export interface AppState {
  dims: GciDimension[];
  proj: string;
  variant: Variant;
  qf: "wszystkie" | FindingLevel;
  expTab: ExpertTab;
  exp: ExportKind;
  fmt: "json" | "csv";
  llm: LlmProvider;
  scanRuns: number;
  scanLog: ScanEvent[];
  slot: string;
  kcat: CalibCategory;
  kw: ExpertWeightsKind;
  kth: number;
  norm: "flat" | "imgw";
  /** Ostrzeżenia oznaczone jako fałszywy alarm */
  fa: Record<string, boolean>;
  /** Oceny trafności podobnych projektów */
  sim: Record<string, "tak" | "nie">;
  layers: Record<LayerKey, boolean>;
  form: NewInvestmentForm;
  queue: QueueItem[];
  hist: HistoryEntry[];
  /** Decyzje w kontroli jakości */
  qState: Record<string, "ok" | "no">;
  sg: "wszystkie" | "wrazliwe" | SourceGroup;
  /** Daty pobrania źródeł nadpisane przyciskiem „Pobierz” */
  srcPulled: Record<number, string>;
  done: Record<string, boolean>;
  qt: "wszystkie" | TaskWhen;
  ben: string;
  rtab: "km" | "audyt";
}

const initialState = (): AppState => ({
  dims: structuredClone(DIM0),
  proj: "RM-2026-002",
  variant: "A",
  qf: "wszystkie",
  expTab: "kolejka",
  exp: "ryzyka",
  fmt: "json",
  llm: "none",
  scanRuns: 2,
  scanLog: [],
  slot: "egib",
  kcat: "progi",
  kw: "kan",
  kth: 0,
  norm: "imgw",
  fa: {},
  sim: {},
  layers: { isok: true, orto: false, bdot: true, egib: true, n2k: true, cieki: true, gesut: true, hs: true },
  form: structuredClone(INITIAL_FORM),
  queue: structuredClone(INITIAL_QUEUE),
  hist: structuredClone(INITIAL_HISTORY),
  qState: {},
  sg: "wszystkie",
  srcPulled: {},
  done: {},
  qt: "dzis",
  ben: "RM-2026-002",
  rtab: "km",
});

export type Overlay =
  | { name: "ryzyko"; risk: string }
  | { name: "notatka" }
  | { name: "dokument"; doc: DocKey }
  | { name: "zapytania"; adr: number }
  | { name: "popraw"; i: number }
  | { name: "szukaj" }
  | { name: "analizuj" };

interface Ctx {
  s: AppState;
  /** Zmiana stanu przez funkcję działającą na kopii (jak mutacja obiektu S w oryginale). */
  update: (fn: (draft: AppState) => void) => void;
  toast: (msg: string) => void;
  toastMsg: { id: number; msg: string } | null;
  overlay: Overlay | null;
  open: (o: Overlay) => void;
  close: () => void;
  go: (k: ScreenKey) => void;
  openProject: (id: string) => void;
  openBeneficiary: (id: string) => void;
  decide: (i: number, dec: QueueStatus, why: string, fix?: string) => void;
  pending: number;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [s, setS] = useState<AppState>(initialState);
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [toastMsg, setToastMsg] = useState<{ id: number; msg: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const update = useCallback((fn: (d: AppState) => void) => {
    setS((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
  }, []);

  const toast = useCallback((msg: string) => {
    setToastMsg({ id: Date.now(), msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2400);
  }, []);

  const close = useCallback(() => setOverlay(null), []);

  const go = useCallback(
    (k: ScreenKey) => {
      setOverlay(null);
      setMenuOpen(false);
      router.push(`/${k}`);
      window.scrollTo({ top: 0 });
    },
    [router],
  );

  const openProject = useCallback(
    (id: string) => {
      update((d) => {
        d.proj = id;
      });
      go("projekt");
    },
    [go, update],
  );

  const openBeneficiary = useCallback(
    (id: string) => {
      update((d) => {
        d.ben = id;
      });
      go("beneficjent");
    },
    [go, update],
  );

  const decide = useCallback(
    (i: number, dec: QueueStatus, why: string, fix?: string) => {
      update((d) => {
        const q = d.queue[i];
        q.st = dec;
        if (fix) q.fix = fix;
        d.hist.unshift({ d: nowPl(), who: "Ekspert sektorowy", w: q.id, dec, why: why || "—", v: "wod-kan v1.3" });
      });
    },
    [update],
  );

  const pending = s.queue.filter((q) => q.st === "oczekuje").length;

  const value = useMemo<Ctx>(
    () => ({ s, update, toast, toastMsg, overlay, open: setOverlay, close, go, openProject, openBeneficiary, decide, pending, menuOpen, setMenuOpen }),
    [s, update, toast, toastMsg, overlay, close, go, openProject, openBeneficiary, decide, pending, menuOpen],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp musi być użyte wewnątrz AppStateProvider");
  return ctx;
}

/** Kopiuje tekst do schowka; gdy przeglądarka odmówi, zaznacza tekst w podanym elemencie. */
export async function copyText(text: string, toast: (m: string) => void, fallbackEl?: HTMLElement | null) {
  try {
    await navigator.clipboard.writeText(text);
    toast("Skopiowano do schowka");
  } catch {
    if (fallbackEl) {
      const r = document.createRange();
      r.selectNodeContents(fallbackEl);
      const sel = getSelection();
      sel?.removeAllRanges();
      sel?.addRange(r);
      toast("Tekst zaznaczony. Skopiuj go skrótem ⌘C");
    }
  }
}
