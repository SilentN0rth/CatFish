"use client";

import { PULLED } from "@/data/projects";
import { sevColor } from "@/lib/format";
import { useApp } from "@/lib/state";
import type { Risk } from "@/lib/types";
import { IconArrow, IconLink } from "@/components/ui/icons";
import { ColorChip, ConfBars, LayerTag, RCode } from "@/components/ui/primitives";

/** Karta ryzyka: sygnał → zdarzenie → wpływ → środki zaradcze, z osobnym poziomem pewności. */
export function RiskCard({ x }: { x: Risk }) {
  const { open } = useApp();
  return (
    <div className="risk">
      <div className="row justify-between gap-2">
        <div className="row gap-2">
          <RCode>{x.r}</RCode>
          <h3>{x.n}</h3>
        </div>
        <div className="row gap-1.5">
          <LayerTag l={x.lay} />
          <ColorChip color={sevColor[x.lvl]} dot>
            ryzyko {x.lvl}
          </ColorChip>
        </div>
      </div>
      <div className="chain">
        <div><div className="k">Sygnał</div>{x.sig}</div>
        <div><div className="k">Zdarzenie</div>{x.ev}</div>
        <div><div className="k">Wpływ</div>{x.im}</div>
        <div><div className="k">Środki zaradcze</div>{x.mt}</div>
      </div>
      <ConfBars c={x.c} />
      <div className="row mt-1.5 justify-between">
        <div className="src-line mt-1.5">
          <IconLink />
          <span>
            {x.src} · pobrano {PULLED}
          </span>
        </div>
        <button className="btn ghost sm" onClick={() => open({ name: "ryzyko", risk: x.r })}>
          Szczegóły <IconArrow />
        </button>
      </div>
    </div>
  );
}

/** Pasek harmonogramu z końcem kwalifikowalności. */
export function ScheduleBar() {
  const months = ["III", "IV", "V", "VI", "VII", "VIII", "IX"];
  return (
    <div>
      <div className="relative h-[30px] overflow-hidden rounded-lg border border-line-2 bg-surface-2">
        <div className="absolute top-1.5 bottom-1.5 left-0 w-[78%] rounded-md bg-blue opacity-85" />
        <div
          className="absolute top-0 bottom-0 left-[78%] w-[7.6%]"
          style={{ background: "repeating-linear-gradient(45deg,var(--red-s),var(--red-s) 4px,transparent 4px,transparent 8px)" }}
        />
        <div className="absolute top-0 bottom-0 left-[85.6%] w-0.5 bg-red" />
      </div>
      <div className="row mt-1 justify-between text-[11px] text-fg-3">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <div className="faint mt-0.5 text-[11.5px]">Roboty 02.03–15.08.2026 · czerwona linia: koniec kwalifikowalności 31.08.2026</div>
    </div>
  );
}

/** Ocena trafności „tak / nie” – zasila kalibrację podobieństwa. */
export function SimButtons({ id }: { id: string }) {
  const { s, update, toast } = useApp();
  const v = s.sim[id];
  const set = (val: "tak" | "nie") => {
    update((d) => {
      d.sim[id] = val;
    });
    toast(val === "tak" ? "Ocena „trafny” zapisana do kalibracji podobieństwa" : "Ocena „nietrafny” zapisana do kalibracji podobieństwa");
  };
  return (
    <div className="row mt-2 gap-1.5">
      <span className="faint text-[11.5px]">Trafne wskazanie?</span>
      <button className={`btn sm h-[26px] ${v === "tak" ? "ok" : "ghost"}`} onClick={(e) => { e.stopPropagation(); set("tak"); }}>
        Tak
      </button>
      <button className={`btn sm h-[26px] ${v === "nie" ? "no" : "ghost"}`} onClick={(e) => { e.stopPropagation(); set("nie"); }}>
        Nie
      </button>
    </div>
  );
}
