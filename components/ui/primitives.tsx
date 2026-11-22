"use client";

import type { CSSProperties, ReactNode } from "react";
import { PULLED, DOCS, KOR } from "@/data/projects";
import { fmt, gciTone, tint } from "@/lib/format";
import { useApp } from "@/lib/state";
import type { DocKey, Layer, Tone } from "@/lib/types";
import { IconCheck, IconInfo, IconLink, IconStop, IconWarn, IconCalc } from "./icons";

/* ---------- Chip ---------- */
export function Chip({ children, tone = "", dot, className = "", style }: { children: ReactNode; tone?: Tone; dot?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <span className={`chip ${tone} ${className}`} style={style}>
      {dot && <i />}
      {children}
    </span>
  );
}

/** Chip w kolorze znaczenia (poziom ryzyka, GCI odcinka). */
export function ColorChip({ color, children, dot, pct = 14, className = "" }: { color: string; children: ReactNode; dot?: boolean; pct?: number; className?: string }) {
  return (
    <span className={`chip ${className}`} style={{ background: tint(color, pct), color }}>
      {dot && <i className="block h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function GciPill({ g }: { g: number }) {
  return (
    <Chip tone={gciTone(g)} className="num min-w-[38px] justify-center">
      {g}
    </Chip>
  );
}

/* ---------- Warstwa: źródło / obliczenie / wniosek modelu ---------- */
const LAYER_LABEL: Record<Layer, string> = { src: "Dane źródłowe", calc: "Obliczenie", model: "Wniosek modelu" };
export function LayerTag({ l }: { l: Layer }) {
  return <span className={`lyr ${l}`}>{LAYER_LABEL[l]}</span>;
}
export function AllLayers() {
  return (
    <div className="row gap-1.5">
      <LayerTag l="src" />
      <LayerTag l="calc" />
      <LayerTag l="model" />
    </div>
  );
}

export function RCode({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span className={`rcode ${className}`} style={style}>
      {children}
    </span>
  );
}

/* ---------- Linia źródła ---------- */
export function SourceLine({ text, doc, page, className = "" }: { text: string; doc?: DocKey; page?: number | string; className?: string }) {
  const { open } = useApp();
  return (
    <div className={`src-line ${className}`}>
      <IconLink />
      <span>
        {doc ? (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              open({ name: "dokument", doc });
            }}
          >
            {text}
          </a>
        ) : (
          text
        )}
        {page ? ` · s. ${page}` : ""} · pobrano {PULLED}
      </span>
    </div>
  );
}

export function DocSourceLine({ doc, page }: { doc: DocKey; page?: number | string }) {
  return <SourceLine text={DOCS[doc].name} doc={doc} page={page} />;
}

export function CalcSourceLine({ text }: { text: string }) {
  return (
    <div className="src-line">
      <IconCalc />
      <span>{text}</span>
    </div>
  );
}

/* ---------- Pewność: 3 składowe, osobno od poziomu ryzyka ---------- */
export function ConfBars({ c }: { c: [number, number, number] }) {
  const [a, b, d] = c;
  const overall = Math.round(Math.cbrt(a * b * d) * 100) / 100;
  const parts: [string, number][] = [
    ["Jakość źródła", a],
    ["Zgodność źródeł", b],
    ["Siła wnioskowania", d],
  ];
  return (
    <>
      <div className="conf">
        {parts.map(([n, v]) => (
          <div className="c" key={n}>
            <b>
              <span>{n}</span>
              <span className="num">{fmt(v)}</span>
            </b>
            <Bar value={v} color={v >= 0.6 ? "var(--fg)" : "var(--amber)"} />
          </div>
        ))}
      </div>
      <div className="faint mt-1.5 text-[11.5px]">
        Pewność łączna {fmt(overall)} (średnia geometryczna składowych) – liczona osobno od poziomu ryzyka.
      </div>
    </>
  );
}

/* ---------- Pasek ---------- */
export function Bar({ value, color, className = "", style }: { value: number; color?: string; className?: string; style?: CSSProperties }) {
  return (
    <div className={`bar ${className}`} style={style}>
      <i style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: color }} />
    </div>
  );
}

/** Kwadracik legendy. */
export function Swatch({ color, size = 10 }: { color: string; size?: number }) {
  return <i className="block flex-none rounded-[3px]" style={{ width: size, height: size, background: color }} />;
}

/* ---------- Komunikaty ---------- */
export function Callout({ kind = "", children, className = "" }: { kind?: "" | "info" | "warn" | "stop"; children: ReactNode; className?: string }) {
  const Icon = kind === "warn" ? IconWarn : kind === "stop" ? IconStop : IconInfo;
  return (
    <div className={`callout ${kind} ${className}`}>
      <Icon />
      {typeof children === "string" ? <span>{children}</span> : children}
    </div>
  );
}

/* ---------- Przełącznik segmentowy ---------- */
export function Seg<T extends string>({
  value,
  options,
  onChange,
  className = "",
}: {
  value: T;
  options: readonly (T | readonly [T, string])[];
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={`seg ${className}`} role="group">
      {options.map((o) => {
        const [k, label] = typeof o === "string" ? [o, o] : (o as readonly [T, string]);
        return (
          <button key={k} type="button" aria-pressed={value === k} onClick={() => onChange(k)}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Pole wyboru ---------- */
export function CheckBox({ checked, onChange, label, className = "", style }: { checked: boolean; onChange: (v: boolean) => void; label?: string; className?: string; style?: CSSProperties }) {
  return (
    <span
      className={`box ${className}`}
      role="checkbox"
      tabIndex={0}
      aria-checked={checked}
      aria-label={label}
      style={style}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <IconCheck />
    </span>
  );
}

/* ---------- Nagłówek ekranu ---------- */
export function ScreenHead({ eyebrow, title, sub, children, eyebrowClass = "" }: { eyebrow: ReactNode; title: ReactNode; sub?: ReactNode; children?: ReactNode; eyebrowClass?: string }) {
  return (
    <div className="head">
      <div>
        <div className={`eyebrow ${eyebrowClass}`}>{eyebrow}</div>
        <h1 className="mt-1.5">{title}</h1>
        {sub && (typeof sub === "string" ? <p className="sub">{sub}</p> : sub)}
      </div>
      {children}
    </div>
  );
}

export function CardHead({ title, sub, h = "h2", children }: { title: ReactNode; sub?: ReactNode; h?: "h2" | "h3"; children?: ReactNode }) {
  const H = h;
  return (
    <div className="card-h">
      {sub ? (
        <div>
          <H>{title}</H>
          <p className="faint mt-[3px] text-[12.5px]">{sub}</p>
        </div>
      ) : (
        <H>{title}</H>
      )}
      {children}
    </div>
  );
}

/* ---------- Możliwa korekta finansowa ---------- */
export function KorLine({ id }: { id: string }) {
  const x = KOR[id];
  if (!x || x.k === "—") return null;
  return (
    <div className="kor">
      <span className="eyebrow">Możliwa korekta</span>
      <b className="num">{x.k}</b>
      <span className="faint">
        {x.p} {x.w}. {x.b}. Szacunek wg taryfikatora, do weryfikacji przez opiekuna umowy.
      </span>
    </div>
  );
}

/** Wiersz „etykieta … wartość”. */
export function KV({ k, children, className = "" }: { k: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`row justify-between text-[13px] ${className}`}>
      <span>{k}</span>
      {children}
    </div>
  );
}
