import { RISKS } from "@/data/analysis";
import { DOCS, PROJECTS } from "@/data/projects";
import { FINDINGS } from "@/data/quality";
import type { AppState } from "./state";

/** Rekordy do eksportu. Każdy rekord zachowuje warstwę (źródło / obliczenie / wniosek modelu) i źródło. */
export function exportData(s: AppState): Record<string, unknown>[] {
  if (s.exp === "ryzyka")
    return RISKS.map((r) => ({
      projekt: "NOWA-2026-001",
      kod: r.r,
      nazwa: r.n,
      poziom: r.lvl,
      sygnal: r.sig,
      zdarzenie: r.ev,
      wplyw: r.im,
      srodki: r.mt,
      pewnosc: { jakosc_zrodla: r.c[0], zgodnosc: r.c[1], sila_wnioskowania: r.c[2] },
      warstwa: r.lay === "calc" ? "obliczenie" : "wniosek_modelu",
      zrodlo: r.src,
      pobrano: "2026-11-21T23:52",
    }));
  if (s.exp === "projekty")
    return PROJECTS.map((p) => ({
      id: p.id,
      odbiorca: p.gm,
      wojewodztwo: p.woj,
      nazwa: p.nm,
      podsektor: p.ps,
      podsektor_dodatkowy: p.ps2 ?? null,
      rodzaj_prac: p.rp,
      gci: p.gci,
      identyfikator_publiczny: p.pub,
      zrodlo: "Risk_Miner_dane_projekty.xlsx",
    }));
  if (s.exp === "jakosc")
    return FINDINGS.map((f) => ({ regula: f.rule, projekt: f.project, nazwa: f.title, opis: f.text, poziom: f.level, dowod: f.doc ? DOCS[f.doc].name : "obliczenie" }));
  return s.hist.map((h) => ({ kiedy: h.d, kto: h.who, dotyczy: h.w, decyzja: h.dec, uzasadnienie: h.why, wersja: h.v }));
}

/** Zapisuje tekst jako plik w przeglądarce. */
export function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
