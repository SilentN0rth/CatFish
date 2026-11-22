"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CALIB_CATEGORIES,
  CALIB_SOURCES,
  CALIB_SOURCE_STATE,
  CALIB_VERSIONS,
  CONFIDENCE_BINS,
  CONFIDENCE_PARTS,
  EXPERT_WEIGHTS,
  NORMS,
  ROBUSTNESS,
  RULE_ALARMS,
  SIMILARITY_RATINGS,
  SIMILARITY_WEIGHTS,
  THRESHOLDS,
  WINTER_REGIONS,
  type CalibCategory,
} from "@/data/calibration";
import { fmt, plNum } from "@/lib/format";
import { useApp } from "@/lib/state";
import { SimButtons } from "@/components/domain/risk";
import { IconArrow } from "@/components/ui/icons";
import { Bar, Callout, CardHead, Chip, LayerTag, RCode, Seg } from "@/components/ui/primitives";
import { EASE, Screen } from "@/components/ui/motion";

const NTag = ({ n }: { n: number }) => (n < 10 ? <Chip tone="amber">założenie eksperckie</Chip> : <Chip tone="green">skalibrowane</Chip>);

function Thresholds() {
  const { s, update, toast } = useApp();
  const t = THRESHOLDS[s.kth];
  const W = 300,
    H = 150;
  const x = (v: number) => 20 + (v / (t[3] * 1.25)) * (W - 40);
  const y = (v: number) => H - 20 - v * (H - 40);
  return (
    <div className="card">
      <div className="card-h">
        <div>
          <h2>Progi cech GCI</h2>
          <p className="faint mt-[3px] text-[12.5px]">Zamieniamy pomiar na skalę od 0 do 1. Próg 40 punktów to wartość typowa (połowa projektów ma mniej), a 100 punktów to wartość, której nie przekracza 90% projektów.</p>
        </div>
        <button className="btn secondary sm" onClick={() => toast("Za mało projektów (mniej niż 10), więc to nadal ocena eksperta, a nie wynik z danych")}>
          Zaproponuj na podstawie projektów
        </button>
      </div>
      <div className="grid g-main gap-0">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Cecha</th>
                <th>Jednostka</th>
                <th className="text-right">40 pkt (P50)</th>
                <th className="text-right">100 pkt (P90)</th>
                <th className="text-right">n</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {THRESHOLDS.map((r, i) => (
                <tr
                  key={r[0]}
                  className="click"
                  style={i === s.kth ? { background: "var(--blue-s)" } : undefined}
                  onClick={() =>
                    update((d) => {
                      d.kth = i;
                    })
                  }
                >
                  <td>
                    <b className="font-semibold">{r[0]}</b>
                  </td>
                  <td className="muted">{r[1]}</td>
                  <td className="num text-right">{plNum(r[2])}</td>
                  <td className="num text-right">{plNum(r[3])}</td>
                  <td className="num text-right">{r[4]}</td>
                  <td>
                    <NTag n={r[4]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-b border-l border-line-2">
          <span className="eyebrow">{t[0]}</span>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-2.5 h-auto w-full">
            <line x1="20" y1={H - 20} x2={W - 10} y2={H - 20} stroke="var(--line)" />
            <line x1="20" y1="10" x2="20" y2={H - 20} stroke="var(--line)" />
            <motion.polyline
              key={s.kth}
              points={`${x(0)},${y(0)} ${x(t[2])},${y(0.4)} ${x(t[3])},${y(1)} ${W - 10},${y(1)}`}
              fill="none"
              stroke="var(--blue)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
            />
            {(
              [
                [t[2], 0.4],
                [t[3], 1],
              ] as const
            ).map(([a, b]) => (
              <g key={b}>
                <circle cx={x(a)} cy={y(b)} r="4.5" fill="var(--surface)" stroke="var(--blue)" strokeWidth="2" />
                <line x1={x(a)} y1={y(b)} x2={x(a)} y2={H - 20} stroke="var(--line)" strokeDasharray="3 3" />
                <text x={x(a)} y={H - 6} fontSize="10" fill="var(--fg-3)" textAnchor="middle">
                  {plNum(a)}
                </text>
              </g>
            ))}
            <text x="14" y={y(0.4) + 3} fontSize="10" fill="var(--fg-3)" textAnchor="end">0,4</text>
            <text x="14" y={y(1) + 3} fontSize="10" fill="var(--fg-3)" textAnchor="end">1</text>
          </svg>
          <p className="faint mt-2 text-[12px]">
            Jednostka: {t[1]}. Próba n = {t[4]} &lt; 10, więc progi to założenie eksperckie. Po wpisaniu danych do slotów system zaproponuje P50 i P90.
          </p>
        </div>
      </div>
    </div>
  );
}

function ExpertWeights() {
  const { s, update } = useApp();
  const rows = EXPERT_WEIGHTS[s.kw];
  const cv = (a: number[]) => {
    const m = a.reduce((x, y) => x + y) / a.length;
    return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length) / m;
  };
  return (
    <>
      <div className="card">
        <CardHead title="Wagi ekspertów" sub="Każdy ekspert rozdziela 100 pkt między cechy, osobno dla wodociągu i kanalizacji. Wagi do zatwierdzenia to średnia.">
          <Seg
            value={s.kw}
            options={[["kan", "Kanalizacja"], ["wod", "Wodociąg"]] as const}
            onChange={(v) =>
              update((d) => {
                d.kw = v;
              })
            }
          />
        </CardHead>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Cecha</th>
                <th className="text-right">Ekspert A</th>
                <th className="text-right">B</th>
                <th className="text-right">C</th>
                <th className="text-right">Średnia</th>
                <th>Rozrzut</th>
                <th className="text-right">CV</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([n, ...v]) => {
                const m = v.reduce((a, b) => a + b) / 3,
                  k = cv(v),
                  lo = Math.min(...v),
                  hi = Math.max(...v);
                return (
                  <tr key={n}>
                    <td>
                      <b className="font-semibold">{n}</b>
                    </td>
                    {v.map((x, i) => (
                      <td key={i} className="num text-right">
                        {x}
                      </td>
                    ))}
                    <td className="num text-right">
                      <b>{fmt(m, 1)}</b>
                    </td>
                    <td className="min-w-[140px]">
                      <div className="relative h-2 rounded-lg bg-line-2">
                        <motion.i
                          className="absolute top-0 bottom-0 rounded-lg"
                          initial={false}
                          animate={{ left: `${(lo / 30) * 100}%`, width: `${Math.max(2, ((hi - lo) / 30) * 100)}%` }}
                          transition={{ duration: 0.4, ease: EASE }}
                          style={{ background: k > 0.2 ? "var(--orange)" : "var(--blue)" }}
                        />
                      </div>
                      <span className="faint num text-[11px]">
                        {lo}–{hi}
                      </span>
                    </td>
                    <td className="num text-right" style={k > 0.2 ? { color: "var(--orange)", fontWeight: 600 } : undefined}>
                      {fmt(k)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="card-b">
          <Callout kind="warn">Trzech ekspertów to za mała próba (n &lt; 10). Wagi pozostają założeniem eksperckim; CV &gt; 0,20 oznacza cechę do dyskusji na panelu.</Callout>
        </div>
      </div>
      <div className="card">
        <CardHead h="h3" title="Test odporności ±20%" sub="Każdą wagę zmieniamy o ±20% (18 wariantów) i sprawdzamy, czy projekt zmienia pasmo złożoności.">
          <LayerTag l="calc" />
        </CardHead>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Projekt</th>
                <th className="text-right">GCI</th>
                <th>Zakres przy ±20%</th>
                <th>Pasmo</th>
              </tr>
            </thead>
            <tbody>
              {ROBUSTNESS.map(([n, g, a, b, ok]) => (
                <tr key={n}>
                  <td>{n}</td>
                  <td className="num text-right">
                    <b>{g}</b>
                  </td>
                  <td className="min-w-[180px]">
                    <div className="relative h-2 rounded-lg" style={{ background: "linear-gradient(90deg,var(--green-s) 0 40%,var(--blue-s) 40% 55%,var(--orange-s) 55% 70%,var(--red-s) 70%)" }}>
                      <i className="absolute -top-0.5 -bottom-0.5 rounded-md bg-ink" style={{ left: `${a}%`, width: `${b - a}%` }} />
                    </div>
                    <span className="faint num text-[11px]">
                      {a}–{b}
                    </span>
                  </td>
                  <td>
                    {ok ? (
                      <Chip tone="green" dot>
                        stabilne
                      </Chip>
                    ) : (
                      <Chip tone="orange" dot>
                        zmienia pasmo
                      </Chip>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-b faint text-[12.5px]">Ranking czterech projektów jest taki sam w 16 z 18 wariantów wag.</div>
      </div>
    </>
  );
}

function Confidence() {
  const W = 420,
    H = 190;
  const X = (v: number) => 40 + v * (W - 60);
  const Y = (v: number) => H - 26 - v * (H - 46);
  return (
    <>
      <div className="card">
        <CardHead title="Pewność z 4 składowych" sub="Pewność wniosku to iloczyn składowych. Sprawdzian: przy deklarowanej pewności X ekspert powinien zatwierdzać ok. X wniosków." />
        <div className="card-b grid g2 gap-x-7 gap-y-4">
          {CONFIDENCE_PARTS.map(([n, r]) => (
            <div key={n}>
              <span className="eyebrow">{n}</span>
              {r.map(([a, b]) => (
                <div key={a} className="row flex-nowrap justify-between border-b border-line-2 py-1.5 text-[12.5px]">
                  <span>{a}</span>
                  <b className="num">{fmt(b)}</b>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-h">
          <h3>Deklarowana pewność a odsetek zatwierdzeń</h3>
          <Chip tone="blue">41 decyzji eksperta</Chip>
        </div>
        <div className="card-b grid g-main items-center gap-6">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
            {[0, 0.25, 0.5, 0.75, 1].map((v) => (
              <g key={v}>
                <line x1="40" x2={W - 20} y1={Y(v)} y2={Y(v)} stroke="var(--line-2)" />
                <text x="32" y={Y(v) + 3} fontSize="10" fill="var(--fg-3)" textAnchor="end">
                  {v * 100}%
                </text>
              </g>
            ))}
            <line x1={X(0)} y1={Y(0)} x2={X(1)} y2={Y(1)} stroke="var(--fg-3)" strokeDasharray="4 4" />
            <text x={X(0.93)} y={Y(0.93) - 8} fontSize="10" fill="var(--fg-3)" textAnchor="end">
              idealna kalibracja
            </text>
            {CONFIDENCE_BINS.map(([l, m, a, n], i) => (
              <g key={l}>
                <motion.rect
                  x={X(m) - 18}
                  width="36"
                  rx="5"
                  fill="var(--blue)"
                  opacity={n < 10 ? 0.4 : 0.9}
                  initial={{ y: Y(0), height: 0 }}
                  animate={{ y: Y(a), height: Y(0) - Y(a) }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                />
                <text x={X(m)} y={Y(a) - 6} fontSize="10.5" fontWeight="600" fill="var(--fg)" textAnchor="middle">
                  {Math.round(a * 100)}%
                </text>
                <text x={X(m)} y={H - 12} fontSize="9.5" fill="var(--fg-3)" textAnchor="middle">
                  {l}
                </text>
                <text x={X(m)} y={H - 1} fontSize="9" fill="var(--fg-3)" textAnchor="middle">
                  n={n}
                </text>
              </g>
            ))}
          </svg>
          <div className="stack gap-2.5">
            <Callout>W przedziale 0,6–0,75 eksperci zatwierdzają 64% wniosków, a środek przedziału to 67,5%. Pewność jest lekko zawyżona.</Callout>
            <Callout kind="warn">Przedziały z n &lt; 10 (jaśniejsze słupki) to wciąż założenie eksperckie.</Callout>
          </div>
        </div>
      </div>
    </>
  );
}

function Rules() {
  const { s, go } = useApp();
  const extra = Object.keys(s.fa).length;
  return (
    <div className="card">
      <CardHead title="Reguły i alarmy" sub="Odsetek odrzuceń przez eksperta powyżej 50% oznacza za dużo fałszywych alarmów. Przycisk „Fałszywy alarm” w Monitoringu zasila tę tabelę.">
        <Chip>próg 0,50</Chip>
      </CardHead>
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Reguła</th>
              <th className="text-right">Alarmy</th>
              <th className="text-right">Odrzucone</th>
              <th>Odsetek odrzuceń</th>
              <th>Propozycja</th>
            </tr>
          </thead>
          <tbody>
            {RULE_ALARMS.map(([k, n, a, r0]) => {
              const r = k === "V09" ? r0 + extra : r0;
              const q = r / a;
              return (
                <tr key={k}>
                  <td>
                    <RCode>{k}</RCode> {n}
                  </td>
                  <td className="num text-right">{a}</td>
                  <td className="num text-right">{r}</td>
                  <td className="min-w-[160px]">
                    <Bar value={q} color={q > 0.5 ? "var(--red)" : q > 0.3 ? "var(--orange)" : "var(--green)"} />
                    <span className="faint num text-[11px]">{Math.round(q * 100)}%</span>
                  </td>
                  <td>
                    {q > 0.5 ? (
                      <Chip tone="red" dot>
                        obniż do „informacji”
                      </Chip>
                    ) : a < 10 ? (
                      <Chip tone="amber">założenie eksperckie</Chip>
                    ) : (
                      <Chip tone="green" dot>
                        bez zmian
                      </Chip>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="card-b">
        <button className="btn tonal sm" onClick={() => go("monitoring")}>
          Przejdź do monitoringu <IconArrow />
        </button>
      </div>
    </div>
  );
}

function Norms() {
  const { s, update } = useApp();
  return (
    <>
      <div className="card">
        <CardHead title="Normy harmonogramu i kosztu" sub="Wg metody wykonania i podsektora. Puste pole oznacza brak normy: system pokazuje wtedy tylko obserwacje z bazy." />
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Metoda</th>
                <th>Podsektor</th>
                <th className="text-right">dni/km</th>
                <th className="text-right">zł/km</th>
                <th className="text-right">n</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {NORMS.map((r) => (
                <tr key={r[0] + r[1]}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td className="num text-right">{r[2]}</td>
                  <td className="num text-right">{r[3]}</td>
                  <td className="num text-right">{r[4]}</td>
                  <td>{r[4] ? <NTag n={r[4]} /> : <Chip>brak normy</Chip>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <CardHead h="h3" title="Korekta zimowa" sub="Ile „kosztuje” dzień robót w grudniu–lutym.">
          <Seg
            value={s.norm}
            options={[["flat", "Płaska ×1,3"], ["imgw", "IMGW wg regionu"]] as const}
            onChange={(v) =>
              update((d) => {
                d.norm = v;
              })
            }
          />
        </CardHead>
        <div className="card-b">
          {s.norm === "flat" ? (
            <Callout kind="warn">Jedna wartość 1,3 dla całego kraju to założenie eksperckie. Nie odróżnia Dolnego Śląska od Warmii i Mazur.</Callout>
          ) : (
            <>
              <div className="grid g3 gap-3">
                {WINTER_REGIONS.map(([r, f, d]) => (
                  <div key={r} className="card pad p-3.5 shadow-none">
                    <div className="faint text-[12px]">{r}</div>
                    <div className="row mt-1 justify-between">
                      <b className="num text-[22px]">×{fmt(f)}</b>
                      <span className="faint num text-[11.5px]">{d} dni mroźnych</span>
                    </div>
                    <Bar value={(f - 1) / 0.4} className="mt-2" />
                  </div>
                ))}
              </div>
              <p className="faint mt-3 text-[12px]">Współczynnik z wielolecia IMGW 1991–2020: dni z Tmax &lt; 0 °C, pokrywą śnieżną i opadem ≥ 10 mm w XII–II. Wartości przykładowe do czasu podłączenia danych IMGW.</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function Similarity() {
  const { go, toast } = useApp();
  return (
    <div className="grid g2">
      <div className="card">
        <CardHead title="Wagi podobieństwa" sub="Propozycja z ocen trafności „tak / nie” (n = 12).">
          <Chip tone="green">skalibrowane</Chip>
        </CardHead>
        <div className="card-b stack gap-3">
          {SIMILARITY_WEIGHTS.map(([n, a, b]) => (
            <div key={n}>
              <div className="row justify-between text-[13px]">
                <span>{n}</span>
                <span className="num">
                  {fmt(a)}
                  {a !== b && (
                    <>
                      {" → "}
                      <b className="text-blue">{fmt(b)}</b>
                    </>
                  )}
                </span>
              </div>
              <div className="relative mt-[5px] h-2 rounded-lg bg-line-2">
                <i className="absolute top-0 bottom-0 left-0 rounded-lg bg-line" style={{ width: `${(a / 0.4) * 100}%` }} />
                <i className="absolute top-0 bottom-0 left-0 rounded-lg bg-blue opacity-85" style={{ width: `${(b / 0.4) * 100}%` }} />
              </div>
            </div>
          ))}
          <button className="btn primary self-start" onClick={() => toast("Zapisano nową wersję kalibracji z autorem i datą")}>
            Zapisz propozycję jako v2
          </button>
        </div>
      </div>
      <div className="card">
        <div className="card-h">
          <h3>Ostatnie oceny trafności</h3>
          <button className="btn ghost sm" onClick={() => go("analiza")}>
            Oceń w analizie <IconArrow />
          </button>
        </div>
        {SIMILARITY_RATINGS.map(([id, n, v]) => (
          <div key={id} className="list-row cursor-default">
            <div className="flex-1">
              <b>{n}</b>
              <div className="faint text-[12px]">dla: Kanalizacja Brzozowa – Lipnik</div>
              <SimButtons id={`${id}#k`} />
            </div>
            <Chip tone={v === "tak" ? "green" : "red"} dot>
              {v === "tak" ? "trafny" : "nietrafny"}
            </Chip>
          </div>
        ))}
        <div className="card-b faint text-[12px]">Zławieś Wielka oceniona jako nietrafna: zdarzenie dotyczyło SUW, a nie sieci. Stąd mniejsza waga opisu.</div>
      </div>
    </div>
  );
}

const BODIES: Record<CalibCategory, () => ReactNode> = {
  progi: () => <Thresholds />,
  wagi: () => <ExpertWeights />,
  pewnosc: () => <Confidence />,
  reguly: () => <Rules />,
  normy: () => <Norms />,
  podob: () => <Similarity />,
};

export function Kalibracja() {
  const { s, update, toast } = useApp();
  const c = s.kcat;
  return (
    <Screen>
      <div className="head">
        <div>
          <div className="eyebrow">Kontrola ekspercka</div>
          <h1 className="mt-1.5">Kalibracja</h1>
          <p className="sub">Przy każdej liczbie widać, skąd się wzięła: z danych (co najmniej 10 przypadków) albo z oceny eksperta. Każda zmiana to nowa wersja z autorem i datą, a stare wyniki pamiętają, na jakiej wersji powstały.</p>
        </div>
        <button className="btn primary" onClick={() => toast("Zapisano nową wersję kalibracji z autorem i datą")}>
          Zapisz nową wersję
        </button>
      </div>

      <div className="grid kcats">
        {CALIB_CATEGORIES.map((k, i) => (
          <button
            key={k.k}
            className="card kpi gap-1 px-4 py-3.5 text-left"
            style={c === k.k ? { borderColor: "var(--blue)", boxShadow: "0 0 0 1px var(--fg)" } : undefined}
            onClick={() =>
              update((d) => {
                d.kcat = k.k;
              })
            }
          >
            <span className="eyebrow">{i + 1}</span>
            <b className="text-[14px]">{k.n}</b>
            <span className="row mt-1 gap-1.5">
              <Chip tone={k.status === "skalibrowane" ? "green" : k.status === "częściowo" ? "blue" : "amber"}>{k.status}</Chip>
              <span className="faint num text-[11.5px]">{k.sample}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="grid g-main items-start">
        <AnimatePresence mode="wait">
          <motion.div key={c} className="stack" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.22, ease: EASE }}>
            {BODIES[c]()}
          </motion.div>
        </AnimatePresence>
        <div className="stack">
          <div className="card">
            <div className="card-h">
              <h3>Źródła danych</h3>
              <span className="faint text-[12px]">{CALIB_SOURCES[c].length}</span>
            </div>
            {CALIB_SOURCES[c].map(([n, st]) => (
              <div key={n} className="list-row cursor-default items-center px-5 py-[11px]">
                <span className="flex-1 text-[12.5px]">{n}</span>
                <Chip tone={CALIB_SOURCE_STATE[st].tone} dot>
                  {CALIB_SOURCE_STATE[st].label}
                </Chip>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-h">
              <h3>Wersje</h3>
            </div>
            <div className="card-b">
              <div className="tl">
                {CALIB_VERSIONS[c].map(([v, d, a, k], i) => (
                  <div key={v} className={`ev ${i ? "" : "green"}`}>
                    <div className="when">
                      {d} · {a}
                    </div>
                    <div className="text-[13px] font-semibold">
                      {v} · {k}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}
