"use client";

import { AnimatePresence, motion } from "motion/react";
import { DEFAULT_DESCRIPTION, METHODS } from "@/data/analysis";
import { plNum } from "@/lib/format";
import { useApp } from "@/lib/state";
import type { NewInvestmentForm, StepKey } from "@/lib/types";
import { IconArrow, IconCheck } from "@/components/ui/icons";
import { Bar, Chip, LayerTag, ScreenHead, Seg } from "@/components/ui/primitives";
import { EASE, Screen } from "@/components/ui/motion";

type SegKey = "ps" | "rp" | "kposk";

/** Wartości wyczytane z opisu (ekstrakcja regułowa). */
function entities(f: NewInvestmentForm) {
  return [
    `${plNum(f.km)} km sieci`,
    `${f.pomp} przepompownie`,
    `${f.przyl} przyłączy`,
    "potok Brzozówka → przekroczenie cieku",
    "droga wojewódzka → przejście",
    "linia kolejowa → uzgodnienie zarządcy",
    "KPOŚK: tak",
    "start: III 2026",
  ];
}

function Step({ k, label }: { k: StepKey; label: string }) {
  const { s, update } = useApp();
  const v = s.form[k];
  const change = (delta: number) =>
    update((d) => {
      d.form[k] = Math.max(0, d.form[k] + delta);
    });
  return (
    <div className="field">
      <span className="lbl">{label}</span>
      <div className="stepper">
        <button aria-label="Mniej" onClick={() => change(-1)}>
          −
        </button>
        <motion.span key={v} initial={{ y: -4, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.18, ease: EASE }}>
          {v}
        </motion.span>
        <button aria-label="Więcej" onClick={() => change(1)}>
          +
        </button>
      </div>
    </div>
  );
}

export function Nowa() {
  const { s, update, go, open } = useApp();
  const f = s.form;

  const setSeg = (k: SegKey) => (v: string) =>
    update((d) => {
      d.form[k] = v;
    });

  return (
    <Screen>
      <ScreenHead eyebrow="Nowa inwestycja" title="Nowa inwestycja do sprawdzenia" sub="Opisz inwestycję tak, jak we wniosku o dofinansowanie. Porównamy ją z innymi projektami, policzymy GCI (wskaźnik trudności terenu od 0 do 100) i pokażemy ryzyka razem ze źródłami. Im więcej pól wypełnisz, tym pewniejszy wynik.">
        <div className="row">
          <Chip tone="blue">1 Opis</Chip>
          <span className="faint">›</span>
          <Chip>2 Analiza</Chip>
          <span className="faint">›</span>
          <Chip>3 Teren</Chip>
        </div>
      </ScreenHead>

      <div className="grid g-main">
        <div className="stack">
          <div className="card pad stack gap-3.5">
            <div className="row justify-between">
              <h2>Opis inwestycji</h2>
              <Chip tone="amber">Przykład wypełniony</Chip>
            </div>
            <textarea className="input" id="desc" rows={5} defaultValue={DEFAULT_DESCRIPTION} aria-label="Opis inwestycji" />
            <div className="grid g2">
              <div className="field">
                <span className="lbl">Podsektor główny</span>
                <Seg value={f.ps} options={["Kanalizacja sanitarna", "Sieć wodociągowa"]} onChange={setSeg("ps")} />
              </div>
              <div className="field">
                <label htmlFor="ps2">Podsektor dodatkowy (opcjonalnie)</label>
                <select className="input" id="ps2" defaultValue="brak">
                  <option>brak</option>
                  <option>Sieć wodociągowa</option>
                  <option>Przyłącza</option>
                  <option>Przepompownie sieciowe</option>
                </select>
              </div>
              <div className="field">
                <span className="lbl">Rodzaj prac (osobna cecha)</span>
                <Seg value={f.rp} options={["Budowa / rozbudowa", "Przebudowa / renowacja"]} onChange={setSeg("rp")} />
              </div>
              <div className="field">
                <label htmlFor="kan">Rodzaj kanalizacji</label>
                <select
                  className="input"
                  id="kan"
                  value={f.kan}
                  onChange={(e) =>
                    update((d) => {
                      d.form.kan = e.target.value;
                    })
                  }
                >
                  <option>Grawitacyjno-tłoczna</option>
                  <option>Grawitacyjna</option>
                  <option>Tłoczna</option>
                  <option>Podciśnieniowa</option>
                </select>
              </div>
            </div>
            <div className="field">
              <span className="lbl">Metoda wykonania</span>
              <div className="row gap-2">
                {METHODS.map((m) => (
                  <button
                    key={m}
                    className="toggle-chip"
                    aria-pressed={f.met.includes(m)}
                    onClick={() =>
                      update((d) => {
                        const i = d.form.met.indexOf(m);
                        if (i > -1) d.form.met.splice(i, 1);
                        else d.form.met.push(m);
                      })
                    }
                  >
                    <IconCheck />
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid g3">
              <Step k="cieki" label="Przejścia pod ciekami" />
              <Step k="drogi" label="Przejścia pod drogami" />
              <Step k="tory" label="Przejścia pod torami" />
              <Step k="pomp" label="Przepompownie" />
              <Step k="przyl" label="Przyłącza" />
              <div className="field">
                <label htmlFor="km">Długość sieci [km]</label>
                <input
                  className="input num"
                  id="km"
                  defaultValue="7,8"
                  onChange={(e) => {
                    const v = parseFloat(e.target.value.replace(",", "."));
                    if (!Number.isNaN(v))
                      update((d) => {
                        d.form.km = v;
                      });
                  }}
                />
              </div>
            </div>
            <div className="grid g3">
              <div className="field">
                <span className="lbl">Aglomeracja w KPOŚK (krajowy program oczyszczania ścieków)</span>
                <Seg value={f.kposk} options={["tak", "nie"]} onChange={setSeg("kposk")} />
              </div>
              <div className="field">
                <label htmlFor="d1">Planowany start robót</label>
                <input className="input" id="d1" type="date" defaultValue="2026-03-02" />
              </div>
              <div className="field">
                <label htmlFor="d2">Koniec kwalifikowalności</label>
                <input className="input" id="d2" type="date" defaultValue="2026-08-31" />
              </div>
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <div className="card-h">
              <h3>Co wyczytaliśmy z opisu</h3>
              <LayerTag l="model" />
            </div>
            <div className="card-b row gap-1.5">
              <AnimatePresence initial={false} mode="popLayout">
                {entities(f).map((t) => (
                  <motion.span key={t} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2, ease: EASE }}>
                    <Chip tone="blue">{t}</Chip>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            <div className="card-b pt-0">
              <p className="faint text-[12px]">Ekstrakcja regułowa z opisu. Każda wartość trafia do GCI z etykietą „z opisu” i niższą pewnością niż dane z warstw.</p>
            </div>
          </div>
          <div className="card">
            <div className="card-h">
              <h3>Dane od zespołu</h3>
              <button className="btn ghost sm" onClick={() => go("sloty")}>
                Sloty <IconArrow />
              </button>
            </div>
            <div className="card-b flex flex-col gap-2.5 text-[13px]">
              {(
                [
                  ["EGiB – działki na trasie", "plik GML · 3 pola", "green"],
                  ["BDOT10k / NMT", "4 z 5 pól", "blue"],
                  ["GESUT / KIUT", "slot pusty", ""],
                ] as const
              ).map(([a, b, c]) => (
                <div className="row justify-between" key={a}>
                  <span>{a}</span>
                  <Chip tone={c} dot>
                    {b}
                  </Chip>
                </div>
              ))}
            </div>
          </div>
          <div className="card pad stack gap-3">
            <div className="row justify-between">
              <span className="lbl">Pokrycie danymi przed analizą</span>
              <b className="num">64%</b>
            </div>
            <Bar value={0.64} />
            <button className="btn primary shine h-[42px] w-full" onClick={() => open({ name: "analizuj" })}>
              Sprawdź inwestycję <IconArrow />
            </button>
            <p className="faint text-center text-[12px]">Wynik jest materiałem pomocniczym. Decyzję podejmuje urzędnik.</p>
          </div>
        </div>
      </div>
    </Screen>
  );
}
