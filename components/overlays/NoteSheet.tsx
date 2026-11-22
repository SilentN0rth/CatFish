"use client";

import { useRef } from "react";
import { PULLED } from "@/data/projects";
import { copyText, useApp } from "@/lib/state";
import { SheetHead } from "./OverlayHost";

/** Notatka służbowa – wynik w języku procedury, z przypisami do źródeł. */
export function NoteSheet() {
  const { toast } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <SheetHead eyebrow="Wynik w języku procedury" title="Notatka służbowa" />
      <div className="sh-b">
        <div className="note" ref={ref}>
          <p className="text-right">Warszawa, 22.11.2026 r.</p>
          <p className="mt-2.5">
            <b>NOTATKA SŁUŻBOWA</b>
          </p>
          <p>w sprawie: wstępnej oceny ryzyk inwestycji „Budowa sieci kanalizacji sanitarnej w miejscowościach Brzozowa i Lipnik”</p>
          <h4>1. Ustalenia</h4>
          <p>
            Trasa wariantu A przebiega na odcinku ok. 420 m przez obszar Natura 2000 i przecina potok Brzozówka<sup>[1]</sup>. Na trasie znajdują się 64 działki prywatne, z czego zgody uzyskano dla 21<sup>[2]</sup>. Planowane tempo robót wynosi 21 dni/km wobec mediany 31 dni/km w podobnych projektach (n = 4)<sup>[3]</sup>.
          </p>
          <h4>2. Sygnały ryzyka</h4>
          <p>R04 – uzgodnienia z RDOŚ i Wodami Polskimi (ryzyko wysokie, pewność 0,82); R03 – kolizje i prawa do nieruchomości (wysokie, 0,80); R06 – harmonogram i zapas 16 dni do końca kwalifikowalności (średnie, 0,72).</p>
          <h4>3. Proponowane działania</h4>
          <p>Zwrócić się do beneficjenta o informacje wskazane w załączonym pakiecie zapytań. Rozważyć wariant B trasy (GCI 47).</p>
          <h4>4. Zastrzeżenie</h4>
          <p>Notatkę przygotowano z użyciem narzędzia GeoWATER Risk. Treść ma charakter pomocniczy, nie stanowi oceny zgodności z prawem ani decyzji administracyjnej. Kwestie prawne pozostają do weryfikacji przez opiekuna umowy.</p>
          <p className="mt-3 text-[12px] text-fg-3">
            [1] Warstwa GDOŚ, pobrano {PULLED} · [2] Slot EGiB, wersja 2 · [3] Obliczenie na bazie projektów RM-2026-002, -005, -010, -017
          </p>
        </div>
      </div>
      <div className="sh-f">
        <button className="btn secondary" onClick={() => copyText(ref.current?.innerText ?? "", toast, ref.current)}>
          Kopiuj treść
        </button>
        <button className="btn primary" onClick={() => toast("W aplikacji plik zapisuje się na dysku. W prototypie użyj „Kopiuj”.")}>
          Pobierz .docx
        </button>
      </div>
    </>
  );
}
