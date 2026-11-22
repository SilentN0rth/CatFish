"use client";

import { FINDINGS, LEVELS, LEVEL_COUNTS } from "@/data/quality";
import { useApp } from "@/lib/state";
import type { FindingLevel } from "@/lib/types";
import { IconCheck, IconX } from "@/components/ui/icons";
import { Callout, Chip, RCode, ScreenHead, Seg } from "@/components/ui/primitives";
import { Kpi, Screen } from "@/components/ui/motion";

type Filter = "wszystkie" | FindingLevel;

export function Jakosc() {
  const { s, update, go, open, toast } = useApp();
  const f = s.qf;
  const rows = FINDINGS.filter((x) => f === "wszystkie" || x.level === f);
  const setF = (v: Filter) =>
    update((d) => {
      d.qf = v;
    });

  return (
    <Screen>
      <ScreenHead eyebrow="Kontrola jakości danych" title="36 znalezisk z 32 reguł" sub="Sprawdzamy dane, zanim posłużą do wniosków. Ekspert potwierdza albo odrzuca każde zgłoszenie i może sam zmienić regułę, bez programisty.">
        <button className="btn secondary" onClick={() => go("eksport")}>
          Pobierz listę
        </button>
      </ScreenHead>

      <div className="grid g4">
        {LEVEL_COUNTS.map(({ k, n }) => (
          <Kpi
            key={k}
            as="button"
            label={LEVELS[k].label}
            value={n}
            onClick={() => setF(k)}
            valueStyle={{ color: LEVELS[k].tone ? `var(--${LEVELS[k].tone})` : "var(--fg-2)" }}
            style={f === k ? { borderColor: "var(--blue)", boxShadow: "0 0 0 1px var(--fg)" } : undefined}
          />
        ))}
      </div>

      <div className="card">
        <div className="card-h">
          <Seg<Filter>
            value={f}
            options={[["wszystkie", "Wszystkie"], ...LEVEL_COUNTS.map(({ k }) => [k, LEVELS[k].label] as const)]}
            onChange={setF}
          />
          <span className="faint text-[12px]">Pokazano {rows.length} z 36 (próbka w prototypie)</span>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Reguła</th>
                <th>Projekt</th>
                <th>Znalezisko</th>
                <th>Poziom</th>
                <th>Dowód</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => {
                const k = x.rule + x.project;
                const st = s.qState[k];
                const decide = (v: "ok" | "no") => {
                  update((d) => {
                    d.qState[k] = v;
                  });
                  toast(v === "ok" ? "Znalezisko potwierdzone i zapisane w historii" : "Znalezisko odrzucone");
                };
                return (
                  <tr key={k}>
                    <td>
                      <RCode>{x.rule}</RCode>
                    </td>
                    <td className="mono whitespace-nowrap">{x.project}</td>
                    <td className="min-w-[280px]">
                      <b className="font-semibold">{x.title}</b>
                      <div className="muted mt-0.5 text-[12.5px]">{x.text}</div>
                    </td>
                    <td>
                      <Chip tone={LEVELS[x.level].tone} dot>
                        {LEVELS[x.level].label}
                      </Chip>
                    </td>
                    <td>
                      {x.doc ? (
                        <a
                          href="#"
                          className="text-[12.5px]"
                          onClick={(e) => {
                            e.preventDefault();
                            open({ name: "dokument", doc: x.doc! });
                          }}
                        >
                          fragment, s. 1
                        </a>
                      ) : (
                        <span className="faint text-[12.5px]">obliczenie</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap">
                      {st ? (
                        <Chip tone={st === "ok" ? "green" : ""} dot>
                          {st === "ok" ? "potwierdzone" : "odrzucone"}
                        </Chip>
                      ) : (
                        <div className="row flex-nowrap gap-1">
                          <button className="btn ok sm" aria-label="Potwierdź" onClick={() => decide("ok")}>
                            <IconCheck className="!block" />
                          </button>
                          <button className="btn no sm" aria-label="Odrzuć" onClick={() => decide("no")}>
                            <IconX className="!block" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid g2">
        <div className="card pad stack gap-3">
          <div className="row justify-between">
            <h3>Reguła Q07: aneks podpisany w ostatnim dniu terminu</h3>
            <Chip>wersja 1.2</Chip>
          </div>
          <div className="field">
            <label htmlFor="tol">Tolerancja [dni przed końcem umowy]</label>
            <input className="input num" id="tol" defaultValue="0" />
          </div>
          <div className="field">
            <label htmlFor="lvl">Poziom znaleziska</label>
            <select className="input" id="lvl" defaultValue="niezgodność do weryfikacji">
              <option>niezgodność do weryfikacji</option>
              <option>błąd prawdopodobny</option>
              <option>informacja</option>
            </select>
          </div>
          <button className="btn tonal" onClick={() => toast("Reguła Q07 zapisana jako wersja 1.3")}>
            Zapisz jako wersję 1.3
          </button>
        </div>
        <div className="card pad stack gap-2.5">
          <h3>Jak piszemy o brakach</h3>
          <Callout>Brak informacji zapisujemy jako „nie znaleziono w przeanalizowanych źródłach”.</Callout>
          <Callout>Kwestie prawne mają etykietę „do weryfikacji przez opiekuna umowy”. Narzędzie nie ocenia zgodności z prawem.</Callout>
          <Callout>Wartości ze skanu mają pewność ×0,6 i ostrzeżenie o możliwym błędzie odczytu.</Callout>
        </div>
      </div>
    </Screen>
  );
}
