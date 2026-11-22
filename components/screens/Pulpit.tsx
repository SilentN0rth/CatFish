"use client";

import { PROJECTS, PULLED } from "@/data/projects";
import { tint } from "@/lib/format";
import { useApp } from "@/lib/state";
import { IconArrow } from "@/components/ui/icons";
import { Bar, Callout, CardHead, Chip, GciPill, KorLine, RCode, ScreenHead } from "@/components/ui/primitives";
import { Kpi, Screen } from "@/components/ui/motion";

const ATTENTION: { id: string; t: string; d: string; c: string; s: string }[] = [
  { id: "RM-2026-002", t: "Zagrodno · termin 05.05 → 05.06.2026", d: "Kolizja z wodociągiem, wody gruntowe przy PM2, zależność od oczyszczalni. Protokół w dniu upływu terminu.", c: "var(--red)", s: "wysoka" },
  { id: "RM-2026-005", t: "Zławieś Wielka · +36 dni, 151 481,54 zł", d: "Podstawa z art. 455 ust. 1 pkt 3 Pzp (zmiana umowy bez nowego przetargu), a uzasadnienie pasuje do pkt 4. Brak ogłoszenia o zmianie w przeanalizowanych źródłach.", c: "var(--orange)", s: "średnia" },
  { id: "RM-2026-010", t: "Grodzisko Dolne · skan pisma", d: "NIP i REGON w piśmie nie przechodzą sumy kontrolnej. Możliwy błąd odczytu; konflikt przekazany ekspertowi.", c: "var(--amber)", s: "do weryfikacji" },
];

const BAND_COLORS = ["var(--green)", "var(--blue)", "var(--orange)", "var(--red)"];

export function Pulpit() {
  const { go, openProject, pending } = useApp();
  const bands = (
    [
      [0, 40, "niska"],
      [40, 55, "umiarkowana"],
      [55, 70, "podwyższona"],
      [70, 101, "wysoka"],
    ] as const
  ).map(([a, b, n]) => ({ n, c: PROJECTS.filter((p) => p.gci >= a && p.gci < b).length }));
  const mx = Math.max(...bands.map((b) => b.c));

  return (
    <Screen>
      <ScreenHead eyebrow="Niedziela, 22 listopada 2026" title="Portfel inwestycji wod-kan" sub="18 projektów sieci wodociągowych i kanalizacji sanitarnej z pliku organizatora. Cztery pominęliśmy, bo dotyczą oczyszczalni, stacji uzdatniania wody albo kanalizacji deszczowej.">
        <div className="row">
          <button className="btn secondary" onClick={() => go("zbieranie")}>
            Wczytaj plik Excel
          </button>
          <button className="btn primary" onClick={() => go("nowa")}>
            Sprawdź nową inwestycję <IconArrow />
          </button>
        </div>
      </ScreenHead>

      <div className="grid g4">
        <Kpi label="Projekty w bazie" value={22} desc="18 w zakresie · 4 poza zakresem" onClick={() => go("projekt")} />
        <Kpi label="Ostrzeżenia" value={3} valueClass="text-orange" desc="z ostatniego skanu · dziś 06:00" onClick={() => go("monitoring")} />
        <Kpi label="Do decyzji eksperta" value={pending} desc="wnioski i konflikty źródeł" onClick={() => go("ekspert")} />
        <Kpi label="Jakość danych" value={36} desc="znalezisk · 13 pewnych błędów" onClick={() => go("jakosc")} />
      </div>

      <div className="grid g-main">
        <div className="card">
          <div className="card-h">
            <h2>Wymaga uwagi</h2>
            <button className="btn ghost sm" onClick={() => go("monitoring")}>
              Wszystkie ostrzeżenia <IconArrow />
            </button>
          </div>
          {ATTENTION.map((x) => (
            <div key={x.id} className="list-row" onClick={() => openProject(x.id)}>
              <span className="sev" style={{ background: x.c }} />
              <div className="min-w-0 flex-1">
                <div className="row justify-between gap-2">
                  <b>{x.t}</b>
                  <span className="chip" style={{ background: tint(x.c), color: x.c }}>
                    {x.s}
                  </span>
                </div>
                <p className="muted mt-[3px] text-[13px]">{x.d}</p>
                <KorLine id={x.id} />
                <div className="faint mt-1 text-[12px]">
                  {x.id} · 1 nowy dokument · skan {PULLED}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-h">
            <h2>Złożoność terenowa portfela</h2>
            <span className="faint text-[12px]">GCI to trudność terenu w skali 0–100</span>
          </div>
          <div className="card-b flex flex-col gap-3">
            {bands.map((b, i) => (
              <div key={b.n}>
                <div className="row justify-between text-[13px]">
                  <span>{b.n}</span>
                  <b className="num">{b.c}</b>
                </div>
                <Bar value={b.c / mx} color={BAND_COLORS[i]} className="mt-[5px] h-2.5" />
              </div>
            ))}
            <Callout className="mt-1">GCI to indeks ekspercki. Wagi pochodzą z pakietu sektorowego wod-kan v1.3 i nie są wynikiem kalibracji na danych.</Callout>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <h2>Projekty</h2>
          <div className="row gap-2">
            <span className="faint text-[12px]">Kliknij wiersz, aby otworzyć kartę projektu</span>
            <button className="btn secondary sm" onClick={() => go("eksport")}>
              Eksport
            </button>
          </div>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Przedsięwzięcie</th>
                <th>Podsektor</th>
                <th>Rodzaj prac</th>
                <th>GCI</th>
                <th>Status</th>
                <th>Ryzyka</th>
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map((p) => (
                <tr key={p.id} className="click" onClick={() => openProject(p.id)}>
                  <td className="mono">{p.id}</td>
                  <td className="min-w-[260px]">
                    <b className="font-semibold">{p.nm}</b>
                    <div className="faint text-[12px]">
                      {p.gm} · {p.woj}
                    </div>
                  </td>
                  <td>
                    {p.ps}
                    {p.ps2 && <div className="faint text-[12px]">+ {p.ps2}</div>}
                  </td>
                  <td>{p.rp}</td>
                  <td>
                    <GciPill g={p.gci} />
                  </td>
                  <td>
                    <Chip tone={p.st === "W realizacji" ? "blue" : p.st === "Postępowanie" ? "amber" : ""}>{p.st}</Chip>
                  </td>
                  <td>
                    <div className="row gap-1">
                      {p.r.map((r) => (
                        <RCode key={r}>{r}</RCode>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Screen>
  );
}
