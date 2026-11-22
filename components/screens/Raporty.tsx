"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AUDIT } from "@/data/work";
import { downloadText } from "@/lib/export";
import { copyText, useApp } from "@/lib/state";
import { Callout } from "@/components/ui/primitives";
import { EASE, Screen } from "@/components/ui/motion";

const AUDIT_HEADER = "Kiedy;Kto;Co;Dotyczy;Szczegóły;Wersja;Źródło;Skrót";

function KmReport() {
  const { toast } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const h4 = "mt-3.5 mb-1 font-[inherit]";
  const noFile = () => toast("W aplikacji plik zapisuje się na dysku. W prototypie użyj „Kopiuj”.");
  return (
    <div className="grid g-main">
      <div className="paper" ref={ref}>
        <p className="text-right text-[12px]">Warszawa, 22 listopada 2026 r.</p>
        <h3 className="mt-3.5 mb-1 font-[inherit] text-[16px]">Informacja dla Komitetu Monitorującego</h3>
        <p>
          <i>Inwestycje w sieci wodociągowe i kanalizację sanitarną: stan na 21.11.2026</i>
        </p>
        <h4 className={h4}>1. Portfel</h4>
        <p>Monitorujemy 18 projektów sieci wod-kan o łącznej wartości 142,6 mln zł: 11 w realizacji, 1 w postępowaniu, 6 zakończonych. Średni wskaźnik trudności terenu (GCI) wynosi 53 na 100.</p>
        <h4 className={h4}>2. Opóźnienia i zmiany umów</h4>
        <p>W 7 projektach podpisano aneksy wydłużające termin, średnio o 41 dni. Najczęstsze przyczyny to kolizje z istniejącą siecią, uzgodnienia z zarządcami dróg i kolei oraz warunki atmosferyczne. W jednym przypadku dane IMGW potwierdzają tylko 13 z 30 dni postoju zgłoszonych jako pogodowe.</p>
        <h4 className={h4}>3. Ryzyko korekt</h4>
        <p>W 2 projektach zmiany umów mogą wymagać korekty finansowej. Szacunek według taryfikatora wynosi łącznie do 99&nbsp;070&nbsp;zł. Oba przypadki są w trakcie wyjaśniania z beneficjentami.</p>
        <h4 className={h4}>4. Kwalifikowalność</h4>
        <p>3 projekty KPO kończą się mniej niż 60 dni przed końcem kwalifikowalności wydatków. Zalecamy pilne potwierdzenie harmonogramów.</p>
        <h4 className={h4}>5. Rekomendacje</h4>
        <p>Wymagać inwentaryzacji GESUT i uzgodnień z zarządcami przed ogłoszeniem przetargu. Przy aneksach pogodowych prosić o dziennik budowy i porównywać go z danymi IMGW.</p>
        <p className="mt-4 text-[11.5px] text-[#666]">Źródła: lista projektów FE 2021–2027 i KPO, CST2021, e-Zamówienia, IMGW-PIB, rejestr nieprawidłowości. Wnioski modelu zatwierdził ekspert sektorowy.</p>
      </div>
      <div className="stack gap-4">
        <div className="card pad stack gap-2.5">
          <h3>Pobierz</h3>
          <div className="row">
            <button className="btn primary sm" onClick={noFile}>
              Pobierz .docx
            </button>
            <button className="btn secondary sm" onClick={noFile}>
              Pobierz PDF
            </button>
            <button className="btn ghost sm" onClick={() => copyText(ref.current?.innerText ?? "", toast, ref.current)}>
              Kopiuj tekst
            </button>
          </div>
        </div>
        <div className="card pad stack gap-2">
          <h3>Skąd te liczby</h3>
          {["Portfel i wartości: lista projektów FE i KPO", "Aneksy: CST2021 i dokumenty beneficjentów", "Korekty: taryfikator i rejestr nieprawidłowości", "Pogoda: IMGW-PIB, najbliższa stacja"].map((x) => (
            <div className="check" key={x}>
              {x}
            </div>
          ))}
          <Callout kind="info">Liczby są przykładowe. W narzędziu raport liczy się z bazy w chwili pobrania.</Callout>
        </div>
      </div>
    </div>
  );
}

function AuditTrail() {
  const { toast } = useApp();
  const csv = [AUDIT_HEADER, ...AUDIT.map((r) => r.join(";"))].join("\n");
  return (
    <div className="card">
      <div className="card-h">
        <h2>Kto, co i kiedy zrobił</h2>
        <div className="row">
          <button className="btn secondary sm" onClick={() => copyText(csv, toast)}>
            Kopiuj jako CSV
          </button>
          <button
            className="btn primary sm"
            onClick={() => {
              downloadText("georisk_slad_audytowy.csv", csv, "text/csv");
              toast("Pobrano georisk_slad_audytowy.csv");
            }}
          >
            Pobierz ślad audytowy
          </button>
        </div>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Kiedy</th>
              <th>Kto</th>
              <th>Co</th>
              <th>Dotyczy</th>
              <th>Szczegóły</th>
              <th>Wersja ustawień</th>
              <th>Źródło</th>
              <th>Skrót</th>
            </tr>
          </thead>
          <tbody>
            {AUDIT.map((r) => (
              <tr key={r[0] + r[3]}>
                <td className="num whitespace-nowrap">{r[0]}</td>
                <td className="whitespace-nowrap">{r[1]}</td>
                <td className="whitespace-nowrap">{r[2]}</td>
                <td className="mono">{r[3]}</td>
                <td className="muted min-w-[220px]">{r[4]}</td>
                <td>{r[5]}</td>
                <td className="muted">{r[6]}</td>
                <td className="mono faint">{r[7]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-b">
        <p className="faint text-[12px]">Wpisów nie można zmienić ani usunąć. Skrót pozwala sprawdzić, że nikt nie zmienił wpisu po fakcie. Dane osobowe w eksporcie są zamaskowane.</p>
      </div>
    </div>
  );
}

export function Raporty() {
  const { s, update } = useApp();
  const t = s.rtab;
  const tabs: ["km" | "audyt", string][] = [
    ["km", "Raport dla Komitetu Monitorującego"],
    ["audyt", "Ślad audytowy"],
  ];
  return (
    <Screen>
      <div className="head">
        <div>
          <div className="eyebrow">Kontrola</div>
          <h1 className="mt-1.5">Raporty</h1>
          <p className="sub">Raport dla Komitetu Monitorującego składamy z danych portfela. Ślad audytowy pokazuje każdą decyzję i każde pobranie danych, z autorem i wersją ustawień.</p>
        </div>
      </div>
      <div className="tabs" role="tablist">
        {tabs.map(([k, n]) => (
          <button
            key={k}
            role="tab"
            aria-selected={t === k}
            onClick={() =>
              update((d) => {
                d.rtab = k;
              })
            }
          >
            {n}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={t} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.22, ease: EASE }}>
          {t === "km" ? <KmReport /> : <AuditTrail />}
        </motion.div>
      </AnimatePresence>
    </Screen>
  );
}
