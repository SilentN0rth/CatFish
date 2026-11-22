"use client";

import { motion } from "motion/react";
import { fmt, gciContribution } from "@/lib/format";
import { useApp } from "@/lib/state";
import type { Coverage } from "@/lib/types";
import { Bar, Chip, RCode } from "@/components/ui/primitives";
import { EASE } from "@/components/ui/motion";

const COV_TONE: Record<Coverage, "green" | "blue" | "amber" | ""> = { warstwa: "green", slot: "blue", opis: "amber", brak: "" };
const COV_NAME: Record<Coverage, string> = { warstwa: "z warstwy", slot: "ze slotu", opis: "z opisu", brak: "brak – wartość domyślna" };

/** Wymiary GCI z wagami (suwaki) i wkładem każdej cechy. Wagi to podgląd; zapisuje je ekspert. */
export function DimsTable({ header = false }: { header?: boolean }) {
  const { s, update } = useApp();
  return (
    <>
      {header && (
        <div className="dim-h dim py-2.5">
          <span>Wymiar i warstwa</span>
          <span className="vbar">Wartość cechy</span>
          <span className="w">Waga</span>
          <span className="text-right">Wkład</span>
        </div>
      )}
      <div>
        {s.dims.map((d, i) => {
          const ct = gciContribution(s.dims, i);
          const pct = Math.round(d.w * 100);
          return (
            <div className="dim" key={d.k}>
              <div>
                <div className="nm">{d.n}</div>
                <div className="ly">
                  {d.ly} · <RCode className="text-[10.5px]">{d.r}</RCode>
                </div>
              </div>
              <div className="vbar">
                <div className="row mb-[5px] justify-between text-[12px]">
                  <Chip tone={COV_TONE[d.cov]} className="h-[18px] text-[10.5px]">
                    {COV_NAME[d.cov]}
                  </Chip>
                  <span className="num muted">{fmt(d.v)}</span>
                </div>
                <Bar value={d.v} color={d.v > 0.7 ? "var(--red)" : d.v > 0.5 ? "var(--orange)" : "var(--blue)"} />
              </div>
              <div className="w">
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={pct}
                  aria-label={`Waga: ${d.n}`}
                  style={{ ["--p" as string]: `${(pct / 40) * 100}%` }}
                  onChange={(e) => {
                    const v = Number(e.target.value) / 100;
                    update((st) => {
                      st.dims[i].w = v;
                    });
                  }}
                />
                <output className="num">{fmt(d.w)}</output>
              </div>
              <motion.div className="ct" key={ct.toFixed(1)} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, ease: EASE }}>
                {fmt(ct, 1)}
              </motion.div>
            </div>
          );
        })}
      </div>
    </>
  );
}
