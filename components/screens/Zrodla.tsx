"use client";

import { SOURCES, SOURCE_CLASS, SOURCE_GROUPS, SOURCE_STATE } from "@/data/sources";
import { nowPl } from "@/lib/format";
import { useApp, type AppState } from "@/lib/state";
import type { SourceState } from "@/lib/types";
import { Callout, Chip, ScreenHead, Seg } from "@/components/ui/primitives";
import { Kpi, Screen } from "@/components/ui/motion";

type Group = AppState["sg"];

export function Zrodla() {
  const { s, update, go, toast } = useApp();
  const g = s.sg;
  const list = SOURCES.map((x, i) => ({ ...x, i, pulled: s.srcPulled[i] ?? x.pulled })).filter((x) => g === "wszystkie" || (g === "wrazliwe" ? x.cls !== "pub" : x.group === g));
  const n = (k: SourceState) => SOURCES.filter((x) => x.state === k).length;
  const setG = (v: Group) =>
    update((d) => {
      d.sg = v;
    });
  const today = () => nowPl().split(" ")[0];

  return (
    <Screen>
      <ScreenHead eyebrow="Dane" title="Źródła, z których korzystamy" sub="Wszystko, co ministerstwo ma o projektach wod-kan, plus rejestry branżowe i mapy terenu. Przy każdym źródle widać, kiedy je ostatnio pobraliśmy, ile jest w nim rekordów i czy dane są wrażliwe.">
        <div className="row">
          <button
            className="btn secondary"
            onClick={() => {
              update((d) => {
                SOURCES.forEach((x, i) => {
                  if (x.state === "ok") d.srcPulled[i] = today();
                });
              });
              toast(`Pobrano ${n("ok")} połączonych źródeł`);
            }}
          >
            Pobierz wszystko teraz
          </button>
        </div>
      </ScreenHead>

      <div className="grid g4">
        <Kpi label="Źródła" value={SOURCES.length} desc="w 4 grupach" onClick={() => setG("wszystkie")} />
        <Kpi label="Połączone" value={n("ok")} desc="pobierane automatycznie" onClick={() => setG("wszystkie")} />
        <Kpi label="Dane wrażliwe" value={SOURCES.filter((x) => x.cls !== "pub").length} desc="tylko lokalnie, bez modelu językowego" onClick={() => setG("wrazliwe")} />
        <Kpi label="Wymaga działania" value={n("aut") + n("wn") + n("todo")} valueClass="text-amber" desc="uprawnienia, wnioski, licencje" onClick={() => setG("wszystkie")} />
      </div>

      <div className="row justify-between">
        <Seg<Group> value={g} options={[["wszystkie", "Wszystkie"], ...SOURCE_GROUPS.map((x) => [x.k, x.n] as const), ["wrazliwe", "Wrażliwe"]]} onChange={setG} />
        <span className="faint text-[12px]">Liczby i daty są przykładowe</span>
      </div>

      {SOURCE_GROUPS.filter(({ k }) => list.some((x) => x.group === k)).map(({ k, n: title }) => {
        const rows = list.filter((x) => x.group === k);
        return (
          <div className="card" key={k}>
            <div className="card-h">
              <h2>{title}</h2>
              <span className="faint text-[12px]">{rows.length} źródeł</span>
            </div>
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Źródło</th>
                    <th>Co nam daje</th>
                    <th>Pobrano</th>
                    <th>Rekordy</th>
                    <th>Dane</th>
                    <th>Stan</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((x) => (
                    <tr key={x.name}>
                      <td className="min-w-[200px]">
                        <b className="font-semibold">{x.name}</b>
                        <div className="faint text-[12px]">{x.access}</div>
                      </td>
                      <td className="muted min-w-[220px]">{x.gives}</td>
                      <td className="num whitespace-nowrap">{x.pulled}</td>
                      <td className="num min-w-[120px]">{x.records}</td>
                      <td>
                        <Chip tone={SOURCE_CLASS[x.cls].tone}>{SOURCE_CLASS[x.cls].label}</Chip>
                      </td>
                      <td>
                        <Chip tone={SOURCE_STATE[x.state].tone} dot>
                          {SOURCE_STATE[x.state].label}
                        </Chip>
                      </td>
                      <td className="text-right">
                        {x.state === "ok" ? (
                          <button
                            className="btn ghost sm"
                            onClick={() => {
                              update((d) => {
                                d.srcPulled[x.i] = today();
                              });
                              toast(`${x.name}: pobrano, bez zmian w rekordach`);
                            }}
                          >
                            Pobierz
                          </button>
                        ) : x.state === "todo" ? (
                          <button className="btn ghost sm" onClick={() => toast(`${x.name}: dodano do planu podłączeń`)}>
                            Podłącz
                          </button>
                        ) : (
                          <button className="btn secondary sm" onClick={() => toast(`${x.name}: przygotowano wniosek o dostęp do podpisu`)}>
                            Poproś o dostęp
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <div className="grid g2">
        <div className="card pad stack gap-2.5">
          <h3>Jak chronimy dane wrażliwe</h3>
          {[
            "Dane przetwarzamy tylko na komputerze urzędnika, w sieci resortu.",
            "PESEL, numery ksiąg wieczystych i nazwiska właścicieli działek są usuwane przy wczytaniu.",
            "Przebiegu sieci i lokalizacji obiektów (infrastruktura krytyczna) nie pokazujemy w eksporcie.",
            "Dane wrażliwe nigdy nie trafiają do modelu językowego, także zewnętrznego.",
            "Przy każdym dokumencie zapisujemy, skąd go mamy, na jakiej podstawie i kiedy.",
          ].map((t) => (
            <div className="check" key={t}>
              {t}
            </div>
          ))}
        </div>
        <div className="card pad stack gap-2.5">
          <h3>Czego jeszcze brakuje</h3>
          <p className="muted text-[13px]">Dostęp do CST2021 / SL2021 i rejestru nieprawidłowości daje rola opiekuna umowy. Dane GESUT, pozwolenia wodnoprawne i dane operatorów sieci są dostępne na wniosek. Sekocenbud wymaga licencji.</p>
          <Callout kind="info">Stan podłączeń w działającej wersji narzędzia opisuje lista „Co już działa” w zakładce Eksport.</Callout>
          <div className="row">
            <button className="btn secondary sm" onClick={() => go("eksport")}>
              Zobacz, co już działa
            </button>
          </div>
        </div>
      </div>
    </Screen>
  );
}
