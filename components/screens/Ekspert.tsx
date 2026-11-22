"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { RISK_CATALOG } from "@/data/analysis";
import { fmt, gciValue, nowPl } from "@/lib/format";
import { useApp, type ExpertTab } from "@/lib/state";
import type { QueueStatus } from "@/lib/types";
import { DimsTable } from "@/components/domain/gci";
import { IconCheck, IconEdit, IconX } from "@/components/ui/icons";
import { CheckBox, Chip, KV, LayerTag, RCode, ScreenHead } from "@/components/ui/primitives";
import { EASE, Gauge, Screen } from "@/components/ui/motion";

const TABS: [ExpertTab, string][] = [
  ["kolejka", "Kolejka wniosków"],
  ["historia", "Historia decyzji"],
  ["wagi", "Wagi GCI"],
  ["katalog", "Katalog ryzyk"],
  ["pakiety", "Pakiety sektorowe"],
];

const decTone = (d: string) => (d === "zatwierdzony" ? "green" : d === "odrzucony" ? "red" : "blue");

function Queue() {
  const { s, update, decide, open, toast } = useApp();
  return (
    <div className="card">
      {s.queue.map((q, i) => {
        const decideNow = (dec: QueueStatus) => {
          decide(i, dec, dec === "zatwierdzony" ? "Zgodne ze źródłem." : "Wniosek nie wynika ze źródła.");
          toast(dec === "zatwierdzony" ? "Wniosek zatwierdzony" : "Wniosek odrzucony");
        };
        return (
          <motion.div layout key={q.id} className="risk" transition={{ duration: 0.3, ease: EASE }}>
            <div className="row justify-between gap-2">
              <div className="row gap-2">
                <RCode>{q.id}</RCode>
                <span className="mono faint">{q.p}</span>
                <LayerTag l={q.l} />
              </div>
              <div className="row gap-2">
                <span className="faint num text-[12px]">pewność {fmt(q.c)}</span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={q.st} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.18 }}>
                    <Chip tone={q.st === "oczekuje" ? "amber" : decTone(q.st)} dot>
                      {q.st}
                    </Chip>
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <p className="mt-2 font-medium">{q.t}</p>
            {q.fix && <p className="muted mt-1 text-[13px]">Poprawka: {q.fix}</p>}
            {q.st === "oczekuje" ? (
              <div className="row mt-3 gap-2">
                <button className="btn ok sm" onClick={() => decideNow("zatwierdzony")}>
                  <IconCheck />
                  Zatwierdź
                </button>
                <button className="btn secondary sm" onClick={() => open({ name: "popraw", i })}>
                  <IconEdit />
                  Popraw
                </button>
                <button className="btn no sm" onClick={() => decideNow("odrzucony")}>
                  <IconX />
                  Odrzuć
                </button>
              </div>
            ) : (
              <div className="row mt-2.5">
                <button
                  className="btn ghost sm"
                  onClick={() => {
                    update((d) => {
                      d.queue[i].st = "oczekuje";
                      delete d.queue[i].fix;
                    });
                    toast("Cofnięto decyzję. Zostaje ślad w historii");
                  }}
                >
                  Cofnij decyzję
                </button>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function History() {
  const { s } = useApp();
  return (
    <div className="card">
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Kiedy</th>
              <th>Kto</th>
              <th>Dotyczy</th>
              <th>Decyzja</th>
              <th>Uzasadnienie</th>
              <th>Wersja pakietu</th>
            </tr>
          </thead>
          <tbody>
            {s.hist.map((h, i) => (
              <tr key={i + h.d + h.w}>
                <td className="num whitespace-nowrap">{h.d}</td>
                <td>{h.who}</td>
                <td className="mono">{h.w}</td>
                <td>
                  <Chip tone={decTone(h.dec)} dot>
                    {h.dec}
                  </Chip>
                </td>
                <td className="min-w-[240px]">{h.why}</td>
                <td>{h.v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Weights() {
  const { s, update, toast } = useApp();
  return (
    <div className="grid g-main">
      <div className="card">
        <div className="card-h">
          <h3>Wagi wymiarów GCI</h3>
          <Chip>wersja robocza 1.4</Chip>
        </div>
        <DimsTable />
      </div>
      <div className="stack">
        <div className="card pad flex justify-center">
          <Gauge g={gciValue(s.dims)} />
        </div>
        <div className="card pad stack gap-2.5">
          <b>Wersje pakietu wod-kan</b>
          {(
            [
              ["v1.3", "20.11.2026", "aktywna"],
              ["v1.2", "14.11.2026", ""],
              ["v1.1", "08.11.2026", ""],
            ] as const
          ).map(([v, d, a]) => (
            <KV key={v} k={`${v} · ${d}`}>
              {a ? (
                <Chip tone="green" dot>
                  {a}
                </Chip>
              ) : (
                <button className="btn ghost sm" onClick={() => toast(`Przywrócono wagi z wersji ${v} jako wersję roboczą`)}>
                  Przywróć
                </button>
              )}
            </KV>
          ))}
          <button
            className="btn primary"
            onClick={() => {
              update((d) => {
                d.hist.unshift({ d: nowPl(), who: "Ekspert sektorowy", w: "Wagi GCI", dec: "nowa wersja", why: "Zapisano wersję roboczą wag z panelu.", v: "wod-kan v1.4" });
              });
              toast("Zapisano wagi jako wersję v1.4");
            }}
          >
            Zapisz jako v1.4
          </button>
          <p className="faint text-[12px]">Zmiana wag nie wymaga zmian w kodzie. Wagi są założeniem eksperckim.</p>
        </div>
      </div>
    </div>
  );
}

function Catalog() {
  const [active, setActive] = useState(RISK_CATALOG.map(() => true));
  return (
    <div className="card">
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Kod</th>
              <th>Ryzyko</th>
              <th>Sygnały w pakiecie</th>
              <th>Aktywne</th>
            </tr>
          </thead>
          <tbody>
            {RISK_CATALOG.map((r, i) => (
              <tr key={r.name}>
                <td>
                  <RCode>R{String(i + 1).padStart(2, "0")}</RCode>
                </td>
                <td>{r.name}</td>
                <td className="num">{r.signals}</td>
                <td>
                  <CheckBox checked={active[i]} label={`Aktywne: ${r.name}`} onChange={(v) => setActive((a) => a.map((x, j) => (j === i ? v : x)))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Packages() {
  return (
    <div className="grid g2">
      <div className="card pad stack gap-3">
        <div className="row justify-between">
          <h3>Wod-kan</h3>
          <Chip tone="green" dot>
            aktywny · v1.3
          </Chip>
        </div>
        <p className="muted text-[13px]">Sieć wodociągowa i kanalizacja sanitarna.</p>
        {(
          [
            ["Wymiary GCI", "6"],
            ["Sloty danych", "9"],
            ["Reguły jakości", "32"],
            ["Reguły branżowe", "15"],
            ["Elementy niszowe", "32"],
          ] as const
        ).map(([a, b]) => (
          <KV key={a} k={a}>
            <b className="num">{b}</b>
          </KV>
        ))}
      </div>
      <div className="card pad stack gap-3 border-dashed">
        <div className="row justify-between">
          <h3>Drogi</h3>
          <Chip tone="amber" dot>
            szkielet · v0.1
          </Chip>
        </div>
        <p className="muted text-[13px]">Dowód skalowania: ten sam silnik, inny plik konfiguracji.</p>
        {(
          [
            ["Wymiary GCI", "5 (nośność, odwodnienie, kolizje, środowisko, ruch)"],
            ["Sloty danych", "4"],
            ["Reguły", "0"],
          ] as const
        ).map(([a, b]) => (
          <KV key={a} k={a} className="gap-2.5">
            <b>{b}</b>
          </KV>
        ))}
        <pre className="code max-h-[140px]">{`sector: drogi
version: 0.1
gci_dimensions:
  - {key: nosnosc_gruntu, weight: 0.25, layer: "mapa geologiczna"}
  - {key: odwodnienie, weight: 0.20, layer: "MPHP, NMT"}`}</pre>
      </div>
    </div>
  );
}

export function Ekspert() {
  const { s, update, pending } = useApp();
  const t = s.expTab;
  return (
    <Screen>
      <ScreenHead eyebrow="Kontrola ekspercka" title="Panel eksperta" sub="Tu zatwierdzasz, poprawiasz albo odrzucasz wnioski. Przy każdej decyzji zapisujemy, kto, kiedy i dlaczego ją podjął.">
        <div className="row">
          <Chip tone="amber">{pending} oczekuje</Chip>
        </div>
      </ScreenHead>
      <LayoutGroup>
        <div className="tabs" role="tablist">
          {TABS.map(([k, n]) => (
            <button
              key={k}
              role="tab"
              aria-selected={t === k}
              onClick={() =>
                update((d) => {
                  d.expTab = k;
                })
              }
            >
              {n}
            </button>
          ))}
        </div>
      </LayoutGroup>
      <AnimatePresence mode="wait">
        <motion.div key={t} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.22, ease: EASE }}>
          {t === "kolejka" && <Queue />}
          {t === "historia" && <History />}
          {t === "wagi" && <Weights />}
          {t === "katalog" && <Catalog />}
          {t === "pakiety" && <Packages />}
        </motion.div>
      </AnimatePresence>
    </Screen>
  );
}
