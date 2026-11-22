"use client";

import { useRef, useState } from "react";
import { fmt } from "@/lib/format";
import { useApp } from "@/lib/state";
import { Callout } from "@/components/ui/primitives";
import { SheetHead } from "./OverlayHost";

/** Poprawka wniosku przez eksperta – uzasadnienie jest wymagane. */
export function FixDialog({ i }: { i: number }) {
  const { s, close, decide, toast } = useApp();
  const q = s.queue[i];
  const [text, setText] = useState(q.t);
  const [lvl, setLvl] = useState("średnie");
  const [conf, setConf] = useState(fmt(q.c));
  const [why, setWhy] = useState("");
  const [err, setErr] = useState(false);
  const whyRef = useRef<HTMLTextAreaElement>(null);

  const save = () => {
    if (!why.trim()) {
      setErr(true);
      whyRef.current?.focus();
      toast("Dodaj uzasadnienie poprawki");
      return;
    }
    decide(i, "poprawiony", why.trim(), `${text} · poziom: ${lvl}`);
    close();
    toast("Poprawka zapisana w historii decyzji");
  };

  return (
    <>
      <SheetHead eyebrow={`Decyzja eksperta · ${q.id}`} title="Popraw wniosek" />
      <div className="sh-b">
        <Callout>{q.t}</Callout>
        <div className="field">
          <label htmlFor="fixTxt">Poprawiona treść</label>
          <textarea className="input" id="fixTxt" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className="grid g2">
          <div className="field">
            <label htmlFor="fixLvl">Poziom ryzyka</label>
            <select className="input" id="fixLvl" value={lvl} onChange={(e) => setLvl(e.target.value)}>
              <option>wysokie</option>
              <option>średnie</option>
              <option>niskie</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="fixC">Pewność</label>
            <input className="input num" id="fixC" value={conf} onChange={(e) => setConf(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="fixWhy">Uzasadnienie (wymagane)</label>
          <textarea
            ref={whyRef}
            className="input"
            id="fixWhy"
            rows={2}
            placeholder="np. decyzja RDOŚ już wydana – dokument beneficjenta z 12.11.2026"
            value={why}
            style={err ? { borderColor: "var(--red)" } : undefined}
            onChange={(e) => {
              setWhy(e.target.value);
              setErr(false);
            }}
          />
        </div>
      </div>
      <div className="sh-f">
        <button className="btn ghost" onClick={close}>
          Anuluj
        </button>
        <button className="btn primary" onClick={save}>
          Zapisz poprawkę
        </button>
      </div>
    </>
  );
}
