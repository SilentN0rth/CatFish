"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DOCS, PULLED } from "@/data/projects";
import { nowPl } from "@/lib/format";
import { useApp } from "@/lib/state";
import { WeatherVerify } from "@/components/domain/weather";
import { Callout, Chip, LayerTag } from "@/components/ui/primitives";
import { EASE, Kpi, Screen } from "@/components/ui/motion";
import { ProgressSteps } from "@/components/ui/ProgressSteps";

const SCAN_STEPS = ["Katalog dokumentów (inbox): 0 nowych plików", "BZP: 0 nowych ogłoszeń dla 18 projektów", "Porównanie skrótów 22 rekordów z poprzednią wersją", "Ocena wpływu na ryzyko"];
const STEP_MS = 500;

const ALERTS: { s: string; id: string; t: string; c: string }[] = [
  { s: "wysoka", id: "RM-2026-002", t: "Zagrodno: wydłużenie terminu, 3 przyczyny, zależność od oczyszczalni", c: "var(--red)" },
  { s: "średnia", id: "RM-2026-005", t: "Zławieś Wielka: +36 dni i roboty dodatkowe 151 481,54 zł; oczekiwane ogłoszenie o zmianie", c: "var(--orange)" },
  { s: "do weryfikacji", id: "RM-2026-010", t: "Grodzisko Dolne: skan, NIP niezgodny z sumą kontrolną", c: "var(--amber)" },
];

export function Monitoring() {
  const { s, update, go, open, openProject, toast } = useApp();
  const [tick, setTick] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const scan = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setTick(0);
    SCAN_STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setTick(i * 2 + 1), i * STEP_MS));
      timers.current.push(setTimeout(() => setTick(i * 2 + 2), i * STEP_MS + 450));
    });
    timers.current.push(
      setTimeout(() => {
        update((d) => {
          d.scanRuns += 1;
          d.scanLog.unshift({ when: nowPl(), n: d.scanRuns });
        });
        setTick(null);
        toast("Sprawdzone. Nic nowego od ostatniego razu");
      }, SCAN_STEPS.length * STEP_MS + 200),
    );
  };
  const running = tick !== null;

  return (
    <Screen>
      <div className="head">
        <div>
          <div className="eyebrow">Monitoring</div>
          <h1 className="mt-1.5">Co się zmieniło od ostatniego sprawdzenia</h1>
          <p className="sub">Raz na dobę sprawdzamy źródła. Porównujemy każdy projekt z jego poprzednią wersją, czytamy nowe i zmienione dokumenty, oceniamy wpływ na ryzyko i dajemy znać ekspertowi.</p>
        </div>
        <button className="btn primary" onClick={scan} disabled={running}>
          {running ? "Skanuję…" : "Sprawdź teraz"}
        </button>
      </div>

      <div className="grid g4">
        <Kpi label="Częstotliwość" value="24 h" desc="następny: jutro 06:00" />
        <Kpi label="Skany" value={s.scanRuns} desc="1 = linia bazowa z xlsx" />
        <Kpi label="Nowe dokumenty" value={3} desc="katalog inbox" />
        <Kpi label="Ostrzeżenia" value={3} valueClass="text-orange" desc="1 wysoka · 1 średnia · 1 do weryfikacji" />
      </div>

      <AnimatePresence>
        {running && (
          <motion.div className="card pad" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: EASE }}>
            <ProgressSteps steps={SCAN_STEPS} tick={tick ?? 0} />
          </motion.div>
        )}
      </AnimatePresence>

      <WeatherVerify />

      <div className="grid g-main">
        <div className="card">
          <div className="card-h">
            <h2>Zmiany w rekordzie RM-2026-002</h2>
            <Chip tone="blue">skan 2 · {PULLED}</Chip>
          </div>
          <div className="card-b stack gap-3.5">
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pole</th>
                    <th>Poprzednio</th>
                    <th>Teraz</th>
                    <th>Warstwa</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Termin wykonania</td>
                    <td><span className="diff-del num">05.05.2026</span></td>
                    <td><span className="diff-add num">05.06.2026</span></td>
                    <td><LayerTag l="calc" /></td>
                  </tr>
                  <tr>
                    <td>Numer umowy</td>
                    <td className="faint">—</td>
                    <td><span className="diff-add">IR.271.1.2026</span></td>
                    <td><LayerTag l="src" /></td>
                  </tr>
                  <tr>
                    <td>Zdarzenia w projekcie</td>
                    <td className="num">0</td>
                    <td><span className="diff-add num">3</span></td>
                    <td><LayerTag l="src" /></td>
                  </tr>
                  <tr>
                    <td>Ryzyko R06</td>
                    <td><Chip tone="orange">średnie</Chip></td>
                    <td><Chip tone="red">wysokie</Chip></td>
                    <td><LayerTag l="model" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Callout kind="warn">
              <span>
                <b>Wpływ na ryzyko:</b> nowe zdarzenia potwierdzają sygnał zależności od oczyszczalni, widoczny już w opisie projektu w xlsx. Ostrzeżenie o ważności wysokiej przekazano ekspertowi.
              </span>
            </Callout>
            <div className="row">
              <button className="btn tonal sm" onClick={() => openProject("RM-2026-002")}>
                Otwórz kartę projektu
              </button>
              <button className="btn ghost sm" onClick={() => open({ name: "dokument", doc: "zagrodno" })} title={DOCS.zagrodno.name}>
                Pokaż dokument
              </button>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-h">
            <h3>Poprzednie sprawdzenia</h3>
          </div>
          <div className="card-b">
            <div className="tl">
              <AnimatePresence initial={false}>
                {s.scanLog.map((e) => (
                  <motion.div key={e.n} className="ev green" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36, ease: EASE }}>
                    <div className="when">{e.when}</div>
                    <div className="font-semibold">Sprawdzenie {e.n}: bez zmian</div>
                    <div className="faint text-[12px]">22 projekty bez zmian, 0 ostrzeżeń</div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="ev orange">
                <div className="when">{PULLED}</div>
                <div className="font-semibold">Sprawdzenie 2: 3 nowe dokumenty</div>
                <div className="faint text-[12px]">3 rekordy zmienione · 3 ostrzeżenia</div>
              </div>
              <div className="ev green">
                <div className="when">21.11.2026, 23:40</div>
                <div className="font-semibold">Sprawdzenie 1: stan wyjściowy</div>
                <div className="faint text-[12px]">22 rekordy z pliku organizatora</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <h2>Ostrzeżenia</h2>
        </div>
        {ALERTS.map((a) => (
          <div key={a.id} className="list-row" onClick={() => openProject(a.id)}>
            <span className="sev" style={{ background: a.c }} />
            <div className="flex-1">
              <b>{a.t}</b>
              <div className="faint mt-0.5 text-[12px]">
                {a.id} · ważność {a.s}
              </div>
            </div>
            {s.fa[a.id] ? (
              <Chip>fałszywy alarm – zapisany do kalibracji</Chip>
            ) : (
              <button
                className="btn ghost sm"
                onClick={(e) => {
                  e.stopPropagation();
                  update((d) => {
                    d.fa[a.id] = true;
                  });
                  toast("Oznaczono jako fałszywy alarm. Pomoże to dostroić regułę");
                }}
              >
                Fałszywy alarm
              </button>
            )}
            <button
              className="btn ghost sm"
              onClick={(e) => {
                e.stopPropagation();
                go("ekspert");
              }}
            >
              Do eksperta
            </button>
          </div>
        ))}
      </div>
    </Screen>
  );
}
