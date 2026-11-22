"use client";

import { Fragment } from "react";
import { DOCS, PULLED } from "@/data/projects";
import type { DocKey } from "@/lib/types";
import { useApp } from "@/lib/state";
import { IconLink } from "@/components/ui/icons";
import { Callout, Chip } from "@/components/ui/primitives";
import { SheetHead } from "./OverlayHost";

/** Akapit z podświetleniem fragmentu zapisanego jako [[…]]. */
function Highlighted({ text }: { text: string }) {
  const parts = text.split(/\[\[|\]\]/);
  return (
    <p>
      {parts.map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : <Fragment key={i}>{p}</Fragment>))}
    </p>
  );
}

export function DocumentSheet({ doc }: { doc: DocKey }) {
  const { close } = useApp();
  const d = DOCS[doc];
  const scan = d.type.includes("Skan");
  return (
    <>
      <SheetHead eyebrow="Podgląd dokumentu · fragment podświetlony" title={d.name} titleClass="text-[16px] break-all" />
      <div className="sh-b">
        <div className="row gap-1.5">
          <Chip tone={scan ? "amber" : "green"} dot>
            {d.type}
          </Chip>
          <Chip>strona 1 z {d.pages}</Chip>
          <Chip>SHA-256 {d.sha}</Chip>
        </div>
        <div className="rounded-xl border border-line bg-surface-2 p-5">
          <div className="paper">
            <p className="text-center font-bold tracking-[.04em]">{d.title}</p>
            <div className="mt-3 flex flex-col gap-2.5">
              {d.body.map((t, i) => (
                <Highlighted key={i} text={t} />
              ))}
            </div>
          </div>
        </div>
        {scan && <Callout kind="warn">Skan bez warstwy tekstowej. Tekst pochodzi z transkrypcji oznaczonej jawnie; wartości mają pewność ×0,6 i mogą zawierać błędy odczytu.</Callout>}
        <div className="src-line">
          <IconLink />
          <span>Katalog dokumentów (inbox) · pobrano {PULLED} · wersja rekordu 1</span>
        </div>
      </div>
      <div className="sh-f">
        <button className="btn secondary" onClick={close}>
          Zamknij
        </button>
      </div>
    </>
  );
}
