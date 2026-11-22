"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PROJECTS, PULLED } from "@/data/projects";
import { fmt } from "@/lib/format";
import { useApp } from "@/lib/state";
import type { Project } from "@/lib/types";
import { IconArrow } from "@/components/ui/icons";
import { Callout, Chip, LayerTag, ScreenHead } from "@/components/ui/primitives";
import { EASE, Screen } from "@/components/ui/motion";
import { ProgressSteps } from "@/components/ui/ProgressSteps";

const BZP_PROJECTS = PROJECTS.filter((p) => p.pub.includes("BZP"));

/** Symulacja pobrania ogłoszeń z kopii API BZP dla jednego projektu (szukanie po mieście, filtr w kodzie). */
function BzpFetch() {
  const [pid, setPid] = useState(BZP_PROJECTS[0].id);
  const [phase, setPhase] = useState<"idle" | "run" | "done">("idle");
  const [p, setP] = useState<Project | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const run = () => {
    const proj = PROJECTS.find((x) => x.id === pid)!;
    setP(proj);
    setPhase("run");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPhase("done"), 900);
  };
  const city = p ? p.gm.replace("Gmina ", "").split(" –")[0] : "";

  return (
    <div className="card">
      <div className="card-h">
        <div>
          <h2>Pobierz ogłoszenia z BZP dla jednego projektu</h2>
          <p className="faint mt-[3px] text-[12.5px]">Biuletyn Zamówień Publicznych nie pozwala szukać po NIP, więc szukamy po miejscowości i dopiero potem zawężamy wyniki.</p>
        </div>
        <div className="row">
          <select className="input w-auto" id="bzpP" value={pid} onChange={(e) => setPid(e.target.value)} aria-label="Projekt">
            {BZP_PROJECTS.map((x) => (
              <option key={x.id} value={x.id}>
                {x.id} · {x.gm.replace("Gmina ", "")}
              </option>
            ))}
          </select>
          <button className="btn primary" onClick={run}>
            Pobierz
          </button>
        </div>
      </div>
      <div className="card-b">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div key="idle" className="faint text-[13px]" exit={{ opacity: 0 }}>
              Wybierz projekt i uruchom pobieranie, aby zobaczyć zapytanie, filtr i zapisane ogłoszenia.
            </motion.div>
          )}
          {phase === "run" && (
            <motion.div key="run" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProgressSteps steps={[`GET bzp.cytr.us/mo-board/api/v1/notice?…&miejscowosc=${city}`]} tick={1} />
            </motion.div>
          )}
          {phase === "done" && p && (
            <motion.div key="done" className="stack gap-3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
              <ProgressSteps
                tick={99}
                steps={[
                  `Zapytanie po miejscowości „${city}”: 37 ogłoszeń`,
                  `Filtr w kodzie: NIP ${p.id === "RM-2026-001" ? "9121715754" : "z rekordu"} + numer ogłoszenia ${p.pub}`,
                  `Zapisano 3 ogłoszenia do postępowania ${p.id}`,
                ]}
              />
              <div className="tbl-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Typ ogłoszenia</th>
                      <th>Numer</th>
                      <th>Data</th>
                      <th>Warstwa</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Ogłoszenie o zamówieniu</td>
                      <td className="mono">{p.pub}</td>
                      <td className="num">—</td>
                      <td><LayerTag l="src" /></td>
                    </tr>
                    <tr>
                      <td>Ogłoszenie o wyniku postępowania</td>
                      <td className="mono">{p.pub.replace("/01", "/02")}</td>
                      <td className="num">—</td>
                      <td><LayerTag l="src" /></td>
                    </tr>
                    <tr>
                      <td>Ogłoszenie o zmianie umowy</td>
                      <td className="faint">nie znaleziono w przeanalizowanych źródłach</td>
                      <td />
                      <td><LayerTag l="calc" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Callout kind="warn">Przykład odpowiedzi. Klient BZP jest napisany, ale połączenie z kopią API nie zostało zweryfikowane w środowisku budowy.</Callout>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function Zbieranie() {
  const { go, openProject, toast } = useApp();
  return (
    <Screen>
      <ScreenHead eyebrow="Dane" title="Skąd biorą się dane" sub="Każdy projekt dostaje jeden numer RM, do którego dopinamy numery z innych rejestrów. Przy każdym połączeniu widać, na ile jesteśmy pewni. Sprzeczne dane niczego nie nadpisują, tylko trafiają do eksperta." />

      <div className="grid g-main">
        <div className="card pad stack gap-3.5">
          <div className="flex flex-wrap items-center gap-4 rounded-[14px] border-[1.5px] border-dashed border-line bg-surface-2 p-[22px]">
            <div className="grid h-[46px] w-[46px] flex-none place-items-center rounded-xl bg-green-s">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--fg)" strokeWidth="1.5">
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 8l8 8M16 8l-8 8" />
              </svg>
            </div>
            <div className="min-w-[200px] flex-1">
              <b>Risk_Miner_dane_projekty.xlsx</b>
              <div className="faint text-[12.5px]">22 rekordy · 23 kolumny · zaimportowano {PULLED}</div>
            </div>
            <button className="btn secondary" onClick={() => toast("W prototypie plik jest wczytany na stałe. Import działa w wersji Python.")}>
              Wybierz inny plik
            </button>
          </div>
          <div className="grid g3">
            <div>
              <div className="faint text-[12px]">Kanalizacja sanitarna</div>
              <b className="num text-[24px]">11</b>
            </div>
            <div>
              <div className="faint text-[12px]">Sieć wodociągowa</div>
              <b className="num text-[24px]">7</b>
            </div>
            <div>
              <div className="faint text-[12px]">Poza zakresem</div>
              <b className="num text-[24px] text-fg-3">4</b>
              <div className="faint text-[11.5px]">oczyszczalnie, SUW, deszczowa</div>
            </div>
          </div>
          <Callout>Klasyfikacja podsektora i rodzaju prac z nazwy i opisu. Rekordy mieszane (wodociąg + kanalizacja) mają podsektor główny i dodatkowy.</Callout>
        </div>
        <div className="card">
          <div className="card-h">
            <h3>Źródła danych</h3>
          </div>
          {(
            [
              ["XLSX organizatora", "działa", "green"],
              ["Katalog dokumentów PDF / DOCX / skan", "działa", "green"],
              ["BZP – kopia API bzp.cytr.us", "napisany, niezweryfikowany", "amber"],
              ["Geoportal WMS (ortofotomapa, Natura 2000)", "działa przy dostępie do sieci", "amber"],
              ["TED · KIO · CST2021 · BIP", "zaprojektowane", ""],
            ] as const
          ).map(([a, b, c]) => (
            <div key={a} className="list-row cursor-default items-center px-5 py-3">
              <span className="flex-1 text-[13px]">{a}</span>
              <Chip tone={c} dot>
                {b}
              </Chip>
            </div>
          ))}
        </div>
      </div>

      <BzpFetch />

      <div className="grid g2">
        <div className="card">
          <div className="card-h">
            <h3>Jak połączyliśmy dokumenty z projektami</h3>
            <LayerTag l="calc" />
          </div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rekord</th>
                  <th>Dokument</th>
                  <th>Warstwa</th>
                  <th>Pewność</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ["RM-2026-002", "protokół Zagrodno", "L1 numer KPO", 0.98],
                    ["RM-2026-010", "pismo Grodzisko (skan)", "L1 numer KPO", 0.98],
                    ["RM-2026-005", "protokół Zławieś", "L3 tytuł + gmina", 0.85],
                  ] as const
                ).map(([a, b, c, d]) => (
                  <tr key={a} className="click" onClick={() => openProject(a)}>
                    <td className="mono">{a}</td>
                    <td>{b}</td>
                    <td>{c}</td>
                    <td className="num">
                      <b>{fmt(d)}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-b faint text-[12px]">L1 numer KPO / BZP (0,98) → L2 NIP z poprawną sumą kontrolną (0,90) → L3 tytuł + gmina (≤ 0,85)</div>
        </div>
        <div className="card">
          <div className="card-h">
            <h3>Sprzeczności do rozstrzygnięcia</h3>
            <Chip tone="orange">2</Chip>
          </div>
          <div className="list-row" onClick={() => openProject("RM-2026-010")}>
            <span className="sev bg-orange" />
            <div>
              <b>NIP: 8161571014 (skan) ≠ 8161570014 (xlsx)</b>
              <p className="faint text-[12.5px]">Wartość ze skanu nie przechodzi sumy kontrolnej. Żadna wartość nie została nadpisana.</p>
            </div>
          </div>
          <div className="list-row" onClick={() => openProject("RM-2026-005")}>
            <span className="sev bg-amber" />
            <div>
              <b>Podsektor zdarzenia: SUW, a nie sieć</b>
              <p className="faint text-[12.5px]">Ekspert decyduje, czy zdarzenie liczyć do statystyk sieci kanalizacyjnej.</p>
            </div>
          </div>
          <div className="card-b">
            <button className="btn tonal sm" onClick={() => go("ekspert")}>
              Rozstrzygnij w panelu eksperta <IconArrow />
            </button>
          </div>
        </div>
      </div>
    </Screen>
  );
}
