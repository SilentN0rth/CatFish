"use client";

import { Children, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { animate, motion, useReducedMotion, type Variants } from "motion/react";
import { gciBand } from "@/lib/format";

export const EASE = [0.23, 1, 0.32, 1] as const;

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const item: Variants = {
  hidden: { opacity: 0.001, y: 6, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.42, ease: EASE } },
};

/** Kontener ekranu: kolejne sekcje wjeżdżają z lekkim opóźnieniem (jak klasa .enter w HTML). */
export function Screen({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={`stack ${className}`} variants={container} initial="hidden" animate="show">
      {Children.toArray(children).map((c, i) => (
        <motion.div key={i} variants={item} className="min-w-0">
          {c}
        </motion.div>
      ))}
    </motion.div>
  );
}

/** Liczba, która przy wejściu na ekran odlicza od zera. */
export function CountUp({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(value);
  const first = useRef(true);
  useEffect(() => {
    if (reduce || !first.current) {
      setN(value);
      return;
    }
    first.current = false;
    const c = animate(0, value, { duration: 0.7, ease: [0.33, 1, 0.68, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [value, reduce]);
  return <>{n}</>;
}

/** Karta KPI. Liczby do 4 cyfr animują się przy wejściu. */
export function Kpi({
  label,
  value,
  desc,
  onClick,
  valueStyle,
  valueClass = "",
  className = "",
  style,
  as = "div",
}: {
  label: ReactNode;
  value: ReactNode;
  desc?: ReactNode;
  onClick?: () => void;
  valueStyle?: CSSProperties;
  valueClass?: string;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "button";
}) {
  const Tag = as;
  const v = typeof value === "number" && value < 10000 ? <CountUp value={value} /> : value;
  return (
    <Tag className={`card kpi ${onClick ? "" : "cursor-default"} ${as === "button" ? "text-left" : ""} ${className}`} onClick={onClick} style={style}>
      <span className="eyebrow">{label}</span>
      <span className={`v ${valueClass}`} style={valueStyle}>
        {v}
      </span>
      {desc && <span className="d">{desc}</span>}
    </Tag>
  );
}

/** Półokrągły wskaźnik GCI. Łuk i kolor przechodzą płynnie przy zmianie wag. */
export function Gauge({ g }: { g: number }) {
  const [band, color] = gciBand(g);
  return (
    <div className="gauge">
      <svg viewBox="0 0 200 116">
        <path d="M16 104A84 84 0 0 1 184 104" fill="none" stroke="var(--line-2)" strokeWidth="14" strokeLinecap="round" />
        <motion.path
          d="M16 104A84 84 0 0 1 184 104"
          fill="none"
          strokeWidth="14"
          strokeLinecap="round"
          pathLength={100}
          stroke={color}
          style={{ transition: "stroke .3s" }}
          initial={{ strokeDasharray: "0 100" }}
          animate={{ strokeDasharray: `${g} 100` }}
          transition={{ duration: 0.6, ease: EASE }}
        />
        <text x="16" y="116" fontSize="9" fill="var(--fg-3)" textAnchor="middle">0</text>
        <text x="184" y="116" fontSize="9" fill="var(--fg-3)" textAnchor="middle">100</text>
      </svg>
      <div className="val mt-[-62px]">{g}</div>
      <div className="mt-1 font-semibold" style={{ color }}>
        {band}
      </div>
    </div>
  );
}
