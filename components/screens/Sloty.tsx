"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { AGREEMENTS, NICHE, NICHE_STATES, SECTOR_RULES, SLOTS } from "@/data/quality";
import { useApp } from "@/lib/state";
import { Bar, Callout, CheckBox, Chip, RCode, ScreenHead } from "@/components/ui/primitives";
import { EASE, Screen } from "@/components/ui/motion";

const EGIB_FIELDS: [string, string][] = [
  ["Liczba działek na trasie", "112"],
  ["w tym prywatne", "64"],
  ["Zgody / służebności uzyskane", "21"],
  ["Decyzje art. 124 ugn", "—"],
];

export function Sloty() {
  const { s, update, open, toast } = useApp();
  const sl = SLOTS.find((x) => x.k === s.slot) ?? SLOTS[0];
  const [agree, setAgree] = useState(AGREEMENTS.map((a) => a.done));
  const confirmed = agree.filter(Boolean).length;

  return (
    <Screen>
      <ScreenHead eyebrow="Sloty danych · Brzozowa – Lipnik" title="Dane, które ma zespół" sub="Slot to miejsce na konkretne dane od zespołu: liczby albo plik. Jest ich 9 w 7 grupach. Wpisane liczby trafiają do GCI i reguł branżowych, a pliki czytamy jak dokumenty projektu. Każda zmiana zapisuje się jako nowa wersja.">
        <button className="btn primary" onClick={() => open({ name: "zapytania", adr: 0 })}>
          Przygotuj pakiet zapytań
        </button>
      </ScreenHead>

      <div className="grid g3">
        {SLOTS.map((x) => (
          <motion.div
            key={x.k}
            className={`card slot ${s.slot === x.k ? "sel" : ""}`}
            tabIndex={0}
            whileTap={{ scale: 0.985 }}
            onClick={() =>
              update((d) => {
                d.slot = x.k;
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter")
                update((d) => {
                  d.slot = x.k;
                });
            }}
          >
            <div className="row justify-between">
              <span className="eyebrow">{x.group}</span>
              <Chip tone={x.filled === 0 ? "" : x.filled === x.total ? "green" : "blue"} dot>
                {x.file}
              </Chip>
            </div>
            <b className="text-[14px]">{x.name}</b>
            <div>
              <div className="row mb-[5px] justify-between text-[12px] text-fg-3">
                <span>pola</span>
                <span className="num">
                  {x.filled} / {x.total}
                </span>
              </div>
              <Bar value={x.filled / x.total} color={x.filled === x.total ? "var(--green)" : "var(--blue)"} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid g-main">
        <div className="card">
          <div className="card-h">
            <div>
              <h2>32 rzeczy, o które warto zapytać</h2>
              <p className="faint mt-[3px] text-[12.5px]">Szczegóły sieci wod-kan, przez które najczęściej zmienia się umowy.</p>
            </div>
          </div>
          <div className="card-b">
            <div className="row mb-3.5 gap-3.5 text-[12px]">
              {NICHE_STATES.map((n) => (
                <span key={n.label} className="row gap-1.5">
                  <i className="block h-2.5 w-2.5 rounded-[3px]" style={{ background: n.color }} />
                  {n.label}
                </span>
              ))}
            </div>
            <div className="niche">
              {NICHE.map((n) => (
                <button key={n.n} onClick={() => toast(`${n.n}: ${NICHE_STATES[n.s].label}`)}>
                  <i style={{ background: NICHE_STATES[n.s].color }} />
                  <span>{n.n}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="stack">
          <motion.div key={sl.k} className="card pad stack gap-3" initial={{ opacity: 0.5, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: EASE }}>
            <div className="row justify-between">
              <h3>{sl.name}</h3>
              <Chip tone="blue">{sl.file}</Chip>
            </div>
            {s.slot === "egib" ? (
              EGIB_FIELDS.map(([a, b]) => (
                <div className="field" key={a}>
                  <label>{a}</label>
                  <input className="input num" defaultValue={b} aria-label={a} />
                </div>
              ))
            ) : (
              <Callout>{`Wybrany slot: ${sl.filled} z ${sl.total} pól wypełnionych. Pliki GML / CSV są przechowywane z sumą kontrolną; parsowanie do pól jest zaprojektowane.`}</Callout>
            )}
            <div className="row">
              <button className="btn tonal sm" onClick={() => toast("Zapisano. GCI policzony od nowa")}>
                Zapisz nową wersję
              </button>
              <button className="btn ghost sm" onClick={() => toast("W prototypie pliki slotu są przykładowe. Dodawanie działa w wersji Python.")}>
                Dodaj plik
              </button>
            </div>
          </motion.div>

          <div className="card">
            <div className="card-h">
              <h3>Reguły branżowe</h3>
              <Chip tone="orange">4 aktywne</Chip>
            </div>
            {SECTOR_RULES.map((r) => (
              <div key={r.code} className="list-row cursor-default px-5 py-[11px]">
                <RCode>{r.code}</RCode>
                <span className="flex-1 text-[13px]">{r.text}</span>
                <span className="sev" style={{ background: r.color }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <h2>Lista uzgodnień</h2>
          <span className="faint text-[12px]">
            {confirmed} z {AGREEMENTS.length} uzgodnień potwierdzonych
          </span>
        </div>
        <div className="card-b grid g2 gap-x-6 gap-y-0">
          {AGREEMENTS.map((a, i) => (
            <div className="check" key={a.t}>
              <CheckBox checked={agree[i]} label={a.t} onChange={(v) => setAgree((x) => x.map((y, j) => (j === i ? v : y)))} />
              <span>{a.t}</span>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}
