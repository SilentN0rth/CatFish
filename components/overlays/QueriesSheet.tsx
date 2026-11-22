"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ADDRESSEES } from "@/data/analysis";
import { copyText, useApp } from "@/lib/state";
import { EASE } from "@/components/ui/motion";
import { SheetHead } from "./OverlayHost";

/** Pakiet zapytań – jedno pismo na adresata. */
export function QueriesSheet({ adr }: { adr: number }) {
  const { open, toast } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const a = ADDRESSEES[adr];
  return (
    <>
      <SheetHead eyebrow="Jedno pismo na adresata" title="Pakiet zapytań do beneficjenta" />
      <div className="sh-b">
        <div className="seg self-start">
          {ADDRESSEES.map((x, i) => (
            <button key={x.to} aria-pressed={i === adr} onClick={() => open({ name: "zapytania", adr: i })}>
              {x.to.split(" ")[0]}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={adr} className="note" ref={ref} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2, ease: EASE }}>
            <p>
              <b>Adresat:</b> {a.to}
            </p>
            <p>
              <b>Dotyczy:</b> Budowa sieci kanalizacji sanitarnej w miejscowościach Brzozowa i Lipnik
            </p>
            <p className="mt-2.5">{a.text}</p>
            <p className="mt-2.5">Wskazane informacje nie zostały znalezione w przeanalizowanych źródłach. Brak w źródłach nie oznacza, że dokumenty nie istnieją.</p>
          </motion.div>
        </AnimatePresence>
        <div className="faint text-[12px]">Pytania wygenerowano z pustych slotów i reguł SL06, SL09, SL13. Pismo wysyła urzędnik.</div>
      </div>
      <div className="sh-f">
        <button className="btn secondary" onClick={() => copyText(ref.current?.innerText ?? "", toast, ref.current)}>
          Kopiuj
        </button>
        <button className="btn primary" onClick={() => toast("W aplikacji plik zapisuje się na dysku. W prototypie użyj „Kopiuj”.")}>
          Pobierz 4 pisma
        </button>
      </div>
    </>
  );
}
