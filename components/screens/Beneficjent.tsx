"use client";

import { BENEFICIARIES } from "@/data/work";
import { useApp } from "@/lib/state";
import { Callout, Chip, LayerTag, ScreenHead, Seg, SourceLine } from "@/components/ui/primitives";
import { Kpi, Screen } from "@/components/ui/motion";

export function Beneficjent() {
  const { s, open, openProject, openBeneficiary } = useApp();
  const id = BENEFICIARIES[s.ben] ? s.ben : "RM-2026-002";
  const b = BENEFICIARIES[id];
  const ann = b.h.filter((x) => /aneks/.test(x.changes)).length;
  const kor = b.h.filter((x) => x.corrections !== "—").length;

  return (
    <Screen key={id}>
      <ScreenHead eyebrow={`Profil beneficjenta${b.nip ? " · NIP " + b.nip : ""}`} title={b.n} sub="Wszystkie projekty tej gminy z list projektów FE i KPO oraz Mapy Dotacji, a do tego kontrole i korekty z SL2021. Pomaga ocenić, czy problem w obecnym projekcie to wyjątek, czy powtarzający się wzorzec.">
        <div className="row">
          <Seg value={id} options={Object.entries(BENEFICIARIES).map(([k, v]) => [k, v.n.replace("Gmina ", "")] as const)} onChange={openBeneficiary} />
        </div>
      </ScreenHead>

      <div className="grid g4">
        <Kpi label="Projekty wod-kan" value={b.h.length} desc={`od 2007 roku, ${b.woj}`} />
        <Kpi label="Z aneksem" value={ann} desc={`z ${b.h.length} projektów`} />
        <Kpi label="Wcześniejsze korekty" value={kor} valueClass={kor ? "text-red" : ""} desc="z rejestru nieprawidłowości" />
        <Kpi label="Kontrole" value={b.k.length} desc="IZ, IP i Instytucja Audytowa" />
      </div>

      <Callout>Historia projektów, kontrole i korekty na tym ekranie są wymyślone na potrzeby prototypu. Nie dotyczą prawdziwych gmin.</Callout>
      {ann >= 2 && (
        <Callout kind="warn">
          <div>
            <b>Powtarzający się wzorzec:</b> aneksy terminowe w {ann} z {b.h.length} projektów tej gminy. To sygnał do rozmowy o harmonogramie, nie ocena beneficjenta.
          </div>
        </Callout>
      )}

      <div className="card">
        <div className="card-h">
          <h2>Historia projektów</h2>
          <LayerTag l="src" />
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Okres</th>
                <th>Program</th>
                <th>Projekt</th>
                <th>Wartość</th>
                <th>Stan</th>
                <th>Zmiany umowy</th>
                <th>Korekty</th>
              </tr>
            </thead>
            <tbody>
              {b.h.map((x) => (
                <tr key={x.name}>
                  <td className="num">{x.period}</td>
                  <td>{x.program}</td>
                  <td className="min-w-[240px]">{x.name}</td>
                  <td className="num whitespace-nowrap">{x.value}</td>
                  <td>
                    <Chip tone={x.state === "w realizacji" ? "blue" : ""}>{x.state}</Chip>
                  </td>
                  <td className="muted">{x.changes}</td>
                  <td>{x.corrections === "—" ? <span className="faint">—</span> : <Chip tone="red">{x.corrections}</Chip>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-b">
          <SourceLine text="Lista projektów FE 2021–2027, lista projektów KPO, Mapa Dotacji UE" />
        </div>
      </div>

      <div className="grid g2">
        <div className="card">
          <div className="card-h">
            <h2>Kontrole i audyty</h2>
            <Chip tone="amber">wewnętrzne MFiPR</Chip>
          </div>
          {b.k.map((x) => (
            <div className="fact" key={x.year + x.by}>
              <div className="top-l">
                <b>{x.year}</b>
                <span className="faint">
                  {x.by} · {x.kind}
                </span>
              </div>
              <p className="muted mt-1 text-[13px]">{x.result}</p>
            </div>
          ))}
          <div className="card-b">
            <SourceLine text="Rejestr kontroli SL2021, raporty Instytucji Audytowej" />
          </div>
        </div>
        <div className="card pad stack gap-2.5">
          <h3>Co z tego wynika</h3>
          <p className="muted text-[13px]">Historia gminy nie zmienia oceny ryzyka automatycznie. Pokazujemy ją, żeby opiekun umowy wiedział, o co zapytać i na co zwrócić uwagę przy kontroli.</p>
          <div className="row">
            <button className="btn secondary sm" onClick={() => openProject(id)}>
              Otwórz obecny projekt
            </button>
            <button className="btn ghost sm" onClick={() => open({ name: "zapytania", adr: 0 })}>
              Przygotuj pytania
            </button>
          </div>
        </div>
      </div>
    </Screen>
  );
}
