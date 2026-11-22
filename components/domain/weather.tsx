"use client";

import { motion } from "motion/react";
import { WEATHER_DAYS, WEATHER_DAY_COLOR, WEATHER_DAY_LABEL, WEATHER_MONTHS } from "@/data/weather";
import { useApp } from "@/lib/state";
import { IconLink } from "@/components/ui/icons";
import { Bar, Callout, CardHead, Chip, LayerTag, SourceLine, Swatch } from "@/components/ui/primitives";
import { EASE } from "@/components/ui/motion";

/** Pogoda i klimat w oknie robót (dane IMGW z wielolecia – w prototypie przykładowe). */
export function WeatherCard() {
  const mx = 12;
  const tiles = [
    { e: "Przemarzanie", v: "strefa II · 1,0 m", d: "Głębokość przemarzania wg strefy (PN-81/B-03020). Przewód tłoczny ma przykrycie 1,1 m, czyli zapas tylko 0,1 m.", chip: <Chip tone="amber" dot>na granicy</Chip> },
    { e: "Dni z mrozem i opadem", v: "15 + 11 dni", d: "III–VIII, wielolecie 1991–2020: dni z Tmin < 0 °C oraz z opadem ≥ 10 mm.", chip: <Chip tone="blue" dot>korekta +10 dni</Chip> },
    { e: "Zagrożenie powodziowe", v: "180 m w Q1%", d: "Odcinek 3 przy potoku leży w obszarze ISOK. PS2 jest 120 m od granicy. Wykopy przy cieku wypadają w okresie wezbrań roztopowych III–IV.", chip: <Chip tone="orange" dot>ryzyko R02 · R06</Chip> },
    { e: "Susza i niskie wody", v: "3 z 10 lat", d: "Susza hydrologiczna w zlewni w VII–VIII. Niższe wody gruntowe ułatwiają odwodnienie przy PS2. Dla wodociągów sygnał dotyczy wydajności ujęcia.", chip: <Chip tone="green" dot>sprzyja robotom latem</Chip> },
  ];
  return (
    <div className="card">
      <CardHead title="Pogoda i klimat w oknie robót" sub="Zamiast jednej poprawki „na zimę” bierzemy dane IMGW z wielu lat dla regionu: mróz, opady, przemarzanie gruntu, powodzie i suszę.">
        <div className="row gap-1.5">
          <LayerTag l="calc" />
          <Chip tone="amber">dane przykładowe</Chip>
        </div>
      </CardHead>
      <div className="card-b grid g4 gap-5">
        {tiles.map((t) => (
          <div className="stack gap-1.5" key={t.e}>
            <span className="eyebrow">{t.e}</span>
            <b className="num text-[20px]">{t.v}</b>
            <p className="muted text-[12.5px]">{t.d}</p>
            <div>{t.chip}</div>
          </div>
        ))}
      </div>
      <div className="card-b pt-0">
        <div className="grid g-main items-end gap-6">
          <div>
            <div className="row mb-2 justify-between text-[12px] text-fg-3">
              <span>Średnia liczba dni w miesiącu (IMGW, stacja najbliższa trasie)</span>
              <span className="row gap-2.5">
                <span className="row gap-[5px]"><Swatch color="var(--blue)" />mróz</span>
                <span className="row gap-[5px]"><Swatch color="var(--water)" />opad ≥ 10 mm</span>
              </span>
            </div>
            <div className="grid h-[120px] grid-cols-6 items-end gap-2.5">
              {WEATHER_MONTHS.map(([m, f, r], i) => (
                <div key={m} className="flex h-full flex-col items-center justify-end gap-1">
                  <span className="num faint text-[11px]">{f + r}</span>
                  <motion.div
                    className="flex w-full max-w-[38px] flex-col justify-end overflow-hidden rounded-md"
                    style={{ minHeight: 3 }}
                    initial={{ height: 3 }}
                    whileInView={{ height: ((f + r) / mx) * 84 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.04, ease: EASE }}
                  >
                    <i className="block bg-water" style={{ height: `${(r / (f + r)) * 100}%` }} />
                    <i className="block flex-1 bg-blue" />
                  </motion.div>
                  <span className="text-[11.5px] text-fg-2">{m}</span>
                </div>
              ))}
            </div>
          </div>
          <Callout kind="info">
            <span>
              Korekta = 0,3 × 15 dni z mrozem + 0,5 × 11 dni z opadem ≈ <b>+10 dni</b>. Współczynniki to założenie eksperckie (n &lt; 10), wersja kalibracji v3. Zapas do końca kwalifikowalności spada z 16 do 6 dni.
            </span>
          </Callout>
        </div>
      </div>
      <div className="card-b pt-0">
        <SourceLine text="IMGW-PIB – dane klimatologiczne (wielolecie) · ISOK – mapy zagrożenia powodziowego · Wody Polskie – monitoring suszy" />
      </div>
    </div>
  );
}

/** Reguła W01: weryfikacja przyczyn pogodowych w protokołach zmian. */
export function WeatherVerify() {
  const { toast } = useApp();
  const n = WEATHER_DAYS.filter((x) => x !== "o").length;
  const dayLabel = (i: number) => (12 + i > 31 ? `${12 + i - 31}.02` : `${12 + i}.01`);
  return (
    <div className="card beam">
      <div className="card-h">
        <div>
          <div className="row gap-2">
            <Chip tone="blue">Nowość</Chip>
            <span className="eyebrow">Reguła W01</span>
          </div>
          <h2 className="mt-2">Czy pogoda naprawdę wstrzymała roboty?</h2>
          <p className="faint mt-[3px] text-[12.5px]">Gdy w aneksie pada powód „niekorzystne warunki atmosferyczne”, sprawdzamy dzień po dniu, jaka naprawdę była pogoda na najbliższej stacji IMGW.</p>
        </div>
        <Chip tone="amber">przykład demonstracyjny</Chip>
      </div>
      <div className="card-b grid g-main gap-6">
        <div className="stack gap-3">
          <div className="quote mt-0">…wstrzymanie robót w okresie 12.01–16.02.2026 z uwagi na niekorzystne warunki atmosferyczne; wnioskuje się o wydłużenie terminu o 30 dni…</div>
          <div>
            <div className="grid grid-cols-18 gap-[3px]">
              {WEATHER_DAYS.map((x, i) => (
                <motion.span
                  key={i}
                  title={dayLabel(i)}
                  className="aspect-square rounded-[4px]"
                  style={{ background: WEATHER_DAY_COLOR[x] }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.012, ease: EASE }}
                />
              ))}
            </div>
            <div className="row mt-1.5 justify-between text-[11px] text-fg-3">
              <span>12.01</span>
              <span>31.01</span>
              <span>16.02</span>
            </div>
          </div>
          <div className="row gap-3 text-[12px]">
            {WEATHER_DAY_LABEL.map(([k, label]) => (
              <span className="row gap-[5px]" key={k}>
                <Swatch color={WEATHER_DAY_COLOR[k]} />
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="stack gap-3">
          <div className="grid g2 gap-3">
            <div>
              <div className="faint text-[12px]">Wnioskowane</div>
              <b className="num text-[26px]">30 dni</b>
            </div>
            <div>
              <div className="faint text-[12px]">Potwierdzone przez IMGW</div>
              <b className="num text-[26px] text-orange">{n} dni</b>
            </div>
          </div>
          <Bar value={n / 30} color="var(--orange)" className="h-2.5" />
          <Callout kind="warn">{`Dane pogodowe potwierdzają ${n} z 30 wnioskowanych dni. Rozbieżność do weryfikacji przez opiekuna umowy. To nie jest ocena zasadności zmiany.`}</Callout>
          <div className="row">
            <button className="btn tonal sm" onClick={() => toast("Dodano pytanie do pakietu zapytań do beneficjenta")}>
              Dodaj pytanie do beneficjenta
            </button>
            <button className="btn ghost sm" onClick={() => toast("Zapisano jako fałszywy alarm – reguła W01")}>
              Fałszywy alarm
            </button>
          </div>
          <div className="src-line mt-0">
            <IconLink />
            <span>IMGW-PIB – dane synoptyczne dobowe, stacja najbliższa budowie (14 km) · adapter do podłączenia, wartości przykładowe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
