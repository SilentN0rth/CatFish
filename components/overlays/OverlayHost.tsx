"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useApp, type Overlay } from "@/lib/state";
import { IconX } from "@/components/ui/icons";
import { EASE } from "@/components/ui/motion";
import { RiskSheet } from "./RiskSheet";
import { NoteSheet } from "./NoteSheet";
import { DocumentSheet } from "./DocumentSheet";
import { QueriesSheet } from "./QueriesSheet";
import { FixDialog } from "./FixDialog";
import { SearchDialog } from "./SearchDialog";
import { AnalyzeDialog } from "./AnalyzeDialog";

const CENTER: Overlay["name"][] = ["popraw", "szukaj", "analizuj"];

function body(o: Overlay) {
  switch (o.name) {
    case "ryzyko":
      return <RiskSheet code={o.risk} />;
    case "notatka":
      return <NoteSheet />;
    case "dokument":
      return <DocumentSheet doc={o.doc} />;
    case "zapytania":
      return <QueriesSheet adr={o.adr} />;
    case "popraw":
      return <FixDialog i={o.i} />;
    case "szukaj":
      return <SearchDialog />;
    case "analizuj":
      return <AnalyzeDialog />;
  }
}

/** Nakładki: arkusze z prawej (szczegóły) i okna na środku (decyzje). */
export function OverlayHost() {
  const { overlay, close } = useApp();
  const center = overlay ? CENTER.includes(overlay.name) : false;
  const key = overlay ? JSON.stringify(overlay) : "none";
  return (
    <AnimatePresence>
      {overlay && (
        <motion.div key="scrim" className="scrim" onClick={overlay.name === "analizuj" ? undefined : close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: EASE }} />
      )}
      {overlay &&
        (center ? (
          <motion.div
            key={key}
            className="sheet center"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, x: "-50%", y: "-48%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.96, x: "-50%", y: "-48%" }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {body(overlay)}
          </motion.div>
        ) : (
          <motion.div
            key={overlay.name === "zapytania" ? "zapytania" : key}
            className="sheet side"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 32 }}
            transition={{ duration: 0.34, ease: EASE }}
          >
            {body(overlay)}
          </motion.div>
        ))}
    </AnimatePresence>
  );
}

/** Nagłówek arkusza z przyciskiem zamknięcia. */
export function SheetHead({ eyebrow, title, children, titleClass = "" }: { eyebrow: ReactNode; title: ReactNode; children?: ReactNode; titleClass?: string }) {
  const { close } = useApp();
  return (
    <div className="sh-h">
      <div>
        {typeof eyebrow === "string" ? <div className="eyebrow">{eyebrow}</div> : eyebrow}
        <h2 className={`mt-1.5 ${titleClass}`}>{title}</h2>
        {children}
      </div>
      <button className="icon-btn close" aria-label="Zamknij" onClick={close}>
        <IconX />
      </button>
    </div>
  );
}
