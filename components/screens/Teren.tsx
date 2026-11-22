"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MAP_LAYERS, ROUTES, SEGMENT_NAMES, VARIANT_COMPARISON } from "@/data/terrain";
import { gciColor } from "@/lib/format";
import { useApp } from "@/lib/state";
import type { HotSpot, Variant } from "@/lib/types";
import { RouteMap } from "@/components/map/RouteMap";
import { IconArrow } from "@/components/ui/icons";
import { Callout, CheckBox, ColorChip, LayerTag, ScreenHead, Seg } from "@/components/ui/primitives";
import { EASE, Screen } from "@/components/ui/motion";

export function Teren() {
  const { s, update, go, open } = useApp();
  const [hs, setHs] = useState<HotSpot | null>(null);
  const [rowHover, setRowHover] = useState<string | null>(null);
  const r = ROUTES[s.variant];
  const setVariant = (v: Variant) =>
    update((d) => {
      d.variant = v;
    });

  return (
    <Screen>
      <ScreenHead eyebrow="Teren i trasa" title="Brzozowa – Lipnik: porównanie wariantów" sub="Trudność terenu liczymy osobno dla każdego odcinka trasy. Punkty zapalne to miejsca, w których nakłada się kilka utrudnień naraz.">
        <div className="row">
          <Seg value={s.variant} options={[["A", "Wariant A"], ["B", "Wariant B"]] as const} onChange={setVariant} />
          <button className="btn secondary" onClick={() => go("analiza")}>
            Wróć do analizy
          </button>
        </div>
      </ScreenHead>

      <div className="grid g-main">
        <div className="stack">
          <div className="card px-3 py-2">
            <div className="layers">
              <b className="eyebrow py-1 pr-1.5 pl-0">Co pokazać na mapie</b>
              {MAP_LAYERS.map(({ k, n }) => (
                <label key={k}>
                  <CheckBox
                    checked={s.layers[k]}
                    label={n}
                    onChange={(v) =>
                      update((d) => {
                        d.layers[k] = v;
                      })
                    }
                  />
                  {n}
                </label>
              ))}
            </div>
          </div>
          <RouteMap variant={s.variant} layers={s.layers} highlight={rowHover} onVariant={setVariant} onHotspot={setHs} />
          <Callout>W prototypie cechy GCI odcinków podaje użytkownik, slot danych albo opis. Automatyczne liczenie z warstw BDOT10k, NMT, EGiB i GDOŚ jest zaprojektowane, nie wdrożone. Mapa ma charakter poglądowy.</Callout>
        </div>

        <div className="stack">
          <div className="card">
            <div className="card-h">
              <h3>Porównanie wariantów</h3>
              <LayerTag l="calc" />
            </div>
            <div className="tbl-wrap">
              <table className="cmp">
                <thead>
                  <tr>
                    <th>Cecha</th>
                    <th className="text-right">A</th>
                    <th className="text-right">B</th>
                  </tr>
                </thead>
                <tbody>
                  {VARIANT_COMPARISON.map((x) => (
                    <tr key={x.n}>
                      <td>{x.n}</td>
                      <td className={!x.bBetter ? "better" : ""}>{x.a}</td>
                      <td className={x.bBetter ? "better" : ""}>{x.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-b">
              <Callout kind="info">Wariant B ma niższy GCI kosztem 0,6 km sieci i jednej przepompowni więcej. Wybór należy do projektanta i beneficjenta.</Callout>
            </div>
          </div>

          <div className="card">
            <div className="card-h">
              <h3>Odcinki wariantu {s.variant}</h3>
              <span className="faint num text-[12px]">{r.len} km</span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={s.variant} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: EASE }}>
                {r.gci.map((g, i) => (
                  <div
                    key={i}
                    className="list-row items-center px-5 py-[11px]"
                    onMouseEnter={() => setRowHover(`${s.variant}${i}`)}
                    onMouseLeave={() => setRowHover(null)}
                  >
                    <span className="num w-[22px] font-semibold text-fg-3">{i + 1}</span>
                    <span className="flex-1 text-[13px]">{SEGMENT_NAMES[s.variant][i]}</span>
                    <ColorChip color={gciColor(g)} pct={16} className="num">
                      {g}
                    </ColorChip>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="card pad">
            <AnimatePresence mode="wait">
              {hs ? (
                <motion.div key={hs.n} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: EASE }}>
                  <div className="row justify-between">
                    <span className="eyebrow">Punkt zapalny {hs.n}</span>
                    <ColorChip color={gciColor(hs.g)} pct={16}>
                      GCI {hs.g}
                    </ColorChip>
                  </div>
                  <h3 className="mt-2">{hs.t}</h3>
                  <p className="muted mt-1.5 text-[13px]">{hs.d}</p>
                  <div className="row mt-3">
                    <button className="btn tonal sm" onClick={() => open({ name: "ryzyko", risk: hs.n === 1 ? "R04" : hs.n === 3 ? "R02" : "R03" })}>
                      Karta ryzyka <IconArrow />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty">
                  <span className="eyebrow">Punkt zapalny</span>
                  <p className="muted mt-1.5 text-[13px]">Kliknij numerowany punkt na mapie, aby zobaczyć, które warstwy go tworzą.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Screen>
  );
}
