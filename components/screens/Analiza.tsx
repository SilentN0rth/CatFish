"use client";

import { useState } from "react";
import { RECOMMENDATIONS, RISKS, SIMILAR } from "@/data/analysis";
import { PULLED } from "@/data/projects";
import { gciValue } from "@/lib/format";
import { useApp } from "@/lib/state";
import type { Coverage } from "@/lib/types";
import { DimsTable } from "@/components/domain/gci";
import { RiskCard, ScheduleBar, SimButtons } from "@/components/domain/risk";
import { WeatherCard } from "@/components/domain/weather";
import { IconStop, IconWarn } from "@/components/ui/icons";
import { AllLayers, Bar, Callout, CheckBox, Chip, KV, LayerTag, Swatch } from "@/components/ui/primitives";
import { Gauge, Screen } from "@/components/ui/motion";
import { DIM0 } from "@/data/analysis";

const COVS: [Coverage, string, string][] = [
  ["warstwa", "z warstw", "var(--green)"],
  ["slot", "ze slotów", "var(--blue)"],
  ["opis", "z opisu", "var(--amber)"],
  ["brak", "brak danych", "var(--line)"],
];

export function Analiza() {
  const { s, update, toast, open, go, openProject } = useApp();
  const g = gciValue(s.dims);
  const cnt = (k: Coverage) => s.dims.filter((d) => d.cov === k).length;
  const [recs, setRecs] = useState(RECOMMENDATIONS.map((_, i) => i < 4));

  return (
    <Screen>
      <div className="head">
        <div>
          <div className="eyebrow">Wynik analizy · {PULLED}</div>
          <h1 className="mt-1.5">Kanalizacja sanitarna Brzozowa – Lipnik</h1>
          <div className="row mt-2.5 gap-1.5">
            <Chip tone="blue">Kanalizacja sanitarna</Chip>
            <Chip>Budowa / rozbudowa</Chip>
            <Chip>7,8 km</Chip>
            <Chip>2 przepompownie</Chip>
            <Chip>146 przyłączy</Chip>
            <Chip tone="green">KPOŚK: tak</Chip>
          </div>
        </div>
        <div className="row">
          <button className="btn secondary" onClick={() => open({ name: "zapytania", adr: 0 })}>
            Pytania do beneficjenta
          </button>
          <button className="btn secondary" onClick={() => open({ name: "notatka" })}>
            Notatka służbowa
          </button>
          <button className="btn primary" onClick={() => go("teren")}>
            Teren i warianty
          </button>
        </div>
      </div>

      <div className="grid g3">
        <div className="card pad flex flex-col items-center gap-2">
          <div className="row w-full justify-between">
            <span className="eyebrow">GCI · trudność terenu</span>
            <LayerTag l="calc" />
          </div>
          <Gauge g={g} />
          <p className="faint text-center text-[12px]">GCI = 100 × Σ(waga × wartość) / Σ wag. Indeks ekspercki, nie prognoza.</p>
        </div>
        <div className="card pad stack gap-3">
          <div className="row justify-between">
            <span className="eyebrow">Pokrycie danymi</span>
            <b className="num text-[22px]">64%</b>
          </div>
          <div className="stack-bar">
            {COVS.map(([k, , c]) => (
              <i key={k} style={{ width: `${(cnt(k) / 6) * 100}%`, background: c }} />
            ))}
          </div>
          {COVS.map(([k, n, c]) => (
            <div key={k} className="row justify-between text-[13px]">
              <span className="row gap-2">
                <Swatch color={c} />
                {n}
              </span>
              <span className="num muted">{cnt(k)} z 6 wymiarów</span>
            </div>
          ))}
          <p className="faint text-[12px]">Brak danych nie oznacza braku ryzyka. Wymiar „Stan istniejący” liczony z wartości domyślnej.</p>
        </div>
        <div className="card pad stack gap-2.5">
          <div className="row justify-between">
            <span className="eyebrow text-red">Flagi stop</span>
            <Chip tone="red">2</Chip>
          </div>
          <div className="callout stop">
            <IconStop />
            <div>
              <b>Natura 2000 na trasie wariantu A</b>
              <br />
              ok. 420 m w obszarze siedliskowym, przekroczenie potoku. Wymagane uzgodnienia przed przetargiem.
            </div>
          </div>
          <div className="callout stop">
            <IconStop />
            <div>
              <b>Zapas do końca kwalifikowalności: 16 dni</b>
              <br />
              Harmonogram kończy się 15.08.2026, kwalifikowalność 31.08.2026. Wydatki po tej dacie nie zostaną zrefundowane.
            </div>
          </div>
          <div className="callout warn">
            <IconWarn />
            <div>Przejście pod linią kolejową – uzgodnienie z zarządcą infrastruktury.</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <div>
            <h2>Z czego składa się GCI</h2>
            <p className="faint mt-[3px] text-[12.5px]">Przesuń suwak, żeby zobaczyć, jak zmienia się wynik. To tylko podgląd: na stałe wagi zmienia ekspert.</p>
          </div>
          <div className="row">
            <Chip>pakiet wod-kan v1.3</Chip>
            <button
              className="btn secondary sm"
              onClick={() => {
                update((d) => {
                  d.dims = structuredClone(DIM0);
                });
                toast("Przywrócono wagi pakietu wod-kan v1.3");
              }}
            >
              Przywróć wagi
            </button>
          </div>
        </div>
        <DimsTable header />
      </div>

      <WeatherCard />

      <div className="grid g-main">
        <div className="card">
          <div className="card-h">
            <h2>Ryzyka</h2>
            <AllLayers />
          </div>
          {RISKS.map((r) => (
            <RiskCard key={r.r} x={r} />
          ))}
        </div>
        <div className="stack">
          <div className="card">
            <div className="card-h">
              <h3>Podobne projekty</h3>
              <Chip tone="amber">n = 4 · mała próba</Chip>
            </div>
            {SIMILAR.map((p) => (
              <div key={p.id} className="list-row" onClick={() => openProject(p.id)}>
                <div className="min-w-0 flex-1">
                  <div className="row justify-between">
                    <b>{p.name}</b>
                    <span className="num font-bold">{Math.round(p.score * 100)}%</span>
                  </div>
                  <Bar value={p.score} className="my-1.5" />
                  <p className="faint text-[12px]">{p.why}</p>
                  <SimButtons id={p.id} />
                </div>
              </div>
            ))}
            <div className="card-b pt-2">
              <p className="faint text-[12px]">Podobieństwo: podsektor 0,30 · rodzaj prac 0,20 · długość 0,15 · elementy branżowe 0,35. Przy n &lt; 10 pokazujemy projekty z nazwy, bez uogólnień statystycznych.</p>
            </div>
          </div>
          <div className="card pad stack gap-3">
            <div className="row justify-between">
              <h3>Realność harmonogramu</h3>
              <LayerTag l="calc" />
            </div>
            <div className="grid g2 gap-2.5">
              <div>
                <div className="faint text-[12px]">Plan</div>
                <b className="num text-[22px]">21 dni/km</b>
              </div>
              <div>
                <div className="faint text-[12px]">Baza (mediana, n = 4)</div>
                <b className="num text-[22px]">31 dni/km</b>
                <div className="faint text-[11.5px]">zakres 24–46</div>
              </div>
            </div>
            <ScheduleBar />
            <KV k="Korekta pogodowa (IMGW, wielolecie)">
              <b>+10 dni</b>
            </KV>
            <KV k="Zapas do końca kwalifikowalności KPO">
              <b className="text-red">16 → 6 dni</b>
            </KV>
          </div>
          <div className="card pad stack gap-3">
            <div className="row justify-between">
              <h3>O ile może się opóźnić i zdrożeć</h3>
              <LayerTag l="calc" />
            </div>
            <div>
              <KV k="Termin">
                <b className="num">+18% … +62%</b>
              </KV>
              <div className="faint text-[12px]">n = 2: Zagrodno (+1 mies.), Zławieś Wielka (+36 dni)</div>
            </div>
            <div>
              <KV k="Koszt">
                <b className="num">+4,1%</b>
              </KV>
              <div className="faint text-[12px]">n = 1: Zławieś Wielka, roboty dodatkowe 151 481,54 zł</div>
            </div>
            <Callout kind="warn">Próba jest za mała do wnioskowania statystycznego. Przedział pokazuje przypadki, nie prawdopodobieństwo.</Callout>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <h2>Rekomendacje</h2>
          <span className="faint text-[12px]">Zaznaczone trafią do notatki służbowej</span>
        </div>
        <div className="card-b">
          {RECOMMENDATIONS.map((t, i) => (
            <div className="check" key={t}>
              <CheckBox checked={recs[i]} onChange={(v) => setRecs((r) => r.map((x, j) => (j === i ? v : x)))} label={t} />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

