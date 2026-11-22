"use client";

import { DETAIL, DETAILED_IDS, DOCS, PROJECTS, PULLED } from "@/data/projects";
import { fmt, gciBand } from "@/lib/format";
import { useApp } from "@/lib/state";
import type { PackageStatus, Tone } from "@/lib/types";
import { IconArrow } from "@/components/ui/icons";
import { AllLayers, CalcSourceLine, Callout, Chip, KorLine, LayerTag, RCode, SourceLine } from "@/components/ui/primitives";
import { Kpi, Screen } from "@/components/ui/motion";

const PKG_STATUS: Record<PackageStatus, [string, Tone]> = {
  found: ["znaleziony", "green"],
  missing: ["nie ma w dostępnych źródłach", ""],
  ref: ["zidentyfikowany z odwołania", "blue"],
  expected: ["oczekiwany wg sygnału", "amber"],
  sub: ["warunki odtworzone z PPU", "blue"],
};

export function Projekt() {
  const { s, go, open, openProject, openBeneficiary } = useApp();
  const p = PROJECTS.find((x) => x.id === s.proj) ?? PROJECTS[1];
  const d = DETAIL[p.id];

  if (!d) {
    return (
      <Screen>
        <div className="head">
          <div>
            <div className="eyebrow mono">{p.id}</div>
            <h1 className="mt-1.5">{p.nm}</h1>
            <p className="sub">
              {p.gm} · {p.woj}
            </p>
          </div>
        </div>
        <div className="card pad">
          <Callout>{`Dla tego projektu w przeanalizowanych źródłach jest tylko rekord z pliku organizatora (${p.pub}). Pełne karty w prototypie: Zagrodno, Zławieś Wielka, Grodzisko Dolne.`}</Callout>
          <div className="row mt-3.5">
            {DETAILED_IDS.map((id) => (
              <button key={id} className="btn tonal" onClick={() => openProject(id)}>
                {DETAIL[id].short}
              </button>
            ))}
          </div>
        </div>
      </Screen>
    );
  }

  return (
    <Screen key={p.id}>
      <div className="row gap-2">
        {DETAILED_IDS.map((id) => (
          <button key={id} className="toggle-chip" aria-pressed={s.proj === id} onClick={() => openProject(id)}>
            {DETAIL[id].short}
          </button>
        ))}
        <button className="btn ghost sm" onClick={() => go("pulpit")}>
          Wszystkie projekty <IconArrow />
        </button>
      </div>

      <div className="head">
        <div>
          <div className="eyebrow mono tracking-normal">
            {p.id} · {d.kpo}
          </div>
          <h1 className="mt-1.5">{p.nm}</h1>
          <div className="row mt-2.5 gap-1.5">
            <Chip tone="blue">{p.ps}</Chip>
            {p.ps2 && <Chip tone="amber">+ {p.ps2}</Chip>}
            <Chip>{p.rp}</Chip>
            <Chip tone="blue" dot>
              {p.st}
            </Chip>
            <Chip>
              {p.gm} · NIP {d.nip}
            </Chip>
          </div>
        </div>
        <div className="row">
          <button className="btn secondary" onClick={() => openBeneficiary(p.id)}>
            Profil beneficjenta
          </button>
          <button className="btn secondary" onClick={() => open({ name: "notatka" })}>
            Notatka służbowa
          </button>
          <button className="btn primary" onClick={() => go("ekspert")}>
            Przekaż ekspertowi <IconArrow />
          </button>
        </div>
      </div>

      <KorLine id={p.id} />

      <div className="grid g4">
        <Kpi label="GCI projektu" value={p.gci} desc={gciBand(p.gci)[0]} />
        <Kpi label="Dopasowanie źródeł" value={fmt(d.match.score)} valueClass="num" desc={d.match.layer} />
        <Kpi label="Fakty z dokumentów" value={d.facts.length} desc="każdy ze stroną i fragmentem" />
        <Kpi label="Ryzyka" value={p.r.length} desc={p.r.join(" · ")} />
      </div>

      <div className="grid g-main">
        <div className="card">
          <div className="card-h">
            <h2>Ustalenia</h2>
            <AllLayers />
          </div>
          {d.facts.map((f) => (
            <div className="fact" key={f.t}>
              <div className="top-l">
                <LayerTag l={f.l} />
                {f.risk && <RCode>{f.risk}</RCode>}
                {f.rule && <RCode>reguła {f.rule}</RCode>}
              </div>
              <p className="mt-[7px] font-semibold">{f.t}</p>
              {f.s && <p className="muted mt-0.5 text-[13px]">{f.s}</p>}
              {f.q && <div className="quote">{f.q}</div>}
              {f.doc ? <SourceLine text={DOCS[f.doc].name} doc={f.doc} page={f.p} /> : <CalcSourceLine text={`Obliczenie na rekordach projektu · ${PULLED}`} />}
            </div>
          ))}
        </div>
        <div className="stack">
          <div className="card pad">
            <h3 className="mb-3.5">Co się działo</h3>
            <div className="tl">
              {d.timeline.map((e) => (
                <div className={`ev ${e.tone}`} key={e.when + e.title}>
                  <div className="when">{e.when}</div>
                  <div className="text-[13.5px] font-semibold">{e.title}</div>
                  <div className="faint text-[11.5px]">{e.kind}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card pad stack gap-2.5">
            <h3>Skąd mamy te dane</h3>
            {(
              [
                ["Plik organizatora (xlsx)", `wiersz ${PROJECTS.indexOf(p) + 1}`, "green"],
                ["Katalog dokumentów", "1 dokument", "green"],
                ["BZP (bzp.cytr.us)", "wyszukanie po mieście", "amber"],
              ] as const
            ).map(([a, b, c]) => (
              <div className="row justify-between text-[13px]" key={a}>
                <span>{a}</span>
                <Chip tone={c} dot>
                  {b}
                </Chip>
              </div>
            ))}
            <p className="faint text-[12px]">Źródła się nie nadpisują. Każda wersja rekordu jest zachowana, a rozbieżności trafiają do eksperta.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <div>
            <h2>Pakiet dokumentów</h2>
            <p className="faint mt-[3px] text-[12.5px]">Brak pliku nie znaczy, że dokumentu nie ma. Piszemy tylko, czego nie znaleziono w przeanalizowanych źródłach.</p>
          </div>
          <button className="btn secondary sm" onClick={() => open({ name: "zapytania", adr: 0 })}>
            Poproś o brakujące
          </button>
        </div>
        <div className="card-b">
          <div className="pkg">
            {d.pkg.map(({ name, status }) => (
              <div key={name} className={`doc ${status === "found" ? "found" : status === "missing" ? "missing" : ""}`}>
                <span className="t">{name}</span>
                <div>
                  <Chip tone={PKG_STATUS[status][1]} dot>
                    {PKG_STATUS[status][0]}
                  </Chip>
                </div>
                {status === "sub" && <span className="faint text-[11.5px]">warunki kontraktowe odtworzone; brak podpisanego egzemplarza umowy</span>}
                {status === "expected" && <span className="faint text-[11.5px]">sygnał: protokół konieczności</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
}
