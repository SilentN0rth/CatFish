"use client";

import { motion } from "motion/react";
import { RISKS } from "@/data/analysis";
import { DOCS } from "@/data/projects";
import { tint } from "@/lib/format";
import { useApp } from "@/lib/state";
import { Callout, ConfBars, LayerTag, RCode, SourceLine } from "@/components/ui/primitives";
import { EASE } from "@/components/ui/motion";
import { SheetHead } from "./OverlayHost";

export function RiskSheet({ code }: { code: string }) {
  const { open, close, toast } = useApp();
  const x = RISKS.find((r) => r.r === code) ?? RISKS[1];
  const steps: [string, string, string][] = [
    ["Sygnał", "var(--blue)", x.sig],
    ["Zdarzenie", "var(--orange)", x.ev],
    ["Wpływ", "var(--red)", x.im],
    ["Środki zaradcze", "var(--green)", x.mt],
  ];
  return (
    <>
      <SheetHead
        eyebrow={
          <div className="row gap-2">
            <RCode>{x.r}</RCode>
            <LayerTag l={x.lay} />
          </div>
        }
        title={x.n}
        titleClass="!mt-2"
      />
      <div className="sh-b">
        {steps.map(([k, c, t], i) => (
          <motion.div
            key={k}
            className="row flex-nowrap items-start gap-3.5"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.08 + i * 0.06, ease: EASE }}
          >
            <div className="flex flex-col items-center self-stretch">
              <span className="grid h-[26px] w-[26px] place-items-center rounded-full text-[12px] font-bold" style={{ background: tint(c, 15), color: c }}>
                {i + 1}
              </span>
              {i < 3 && <span className="mt-1 w-0.5 flex-1 bg-line" />}
            </div>
            <div className="pb-2">
              <div className="eyebrow" style={{ color: c }}>
                {k}
              </div>
              <p className="mt-1">{t}</p>
            </div>
          </motion.div>
        ))}
        <div className="card pad">
          <b>Pewność wniosku</b>
          <ConfBars c={x.c} />
        </div>
        <div className="card pad">
          <b>Dowody</b>
          <SourceLine text="Warstwa GDOŚ – obszary chronione (WMS)" />
          <SourceLine text={`${DOCS.zagrodno.name} – analogiczne zdarzenie`} doc="zagrodno" page={1} />
          <SourceLine text="Opis inwestycji – formularz analizy" />
        </div>
        <Callout>Poziom ryzyka i pewność to osobne miary. Wysokie ryzyko może mieć niską pewność, gdy dane pochodzą z opisu.</Callout>
      </div>
      <div className="sh-f">
        <button className="btn secondary" onClick={() => open({ name: "popraw", i: 5 })}>
          Popraw wniosek
        </button>
        <button
          className="btn ok"
          onClick={() => {
            close();
            toast("Wniosek zatwierdzony");
          }}
        >
          Zatwierdź
        </button>
      </div>
    </>
  );
}
