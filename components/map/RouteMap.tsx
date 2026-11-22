"use client";

import { useMemo, useRef, useState } from "react";
import { HOTSPOTS, ROUTES, SEGMENT_NAMES } from "@/data/terrain";
import { gciColor } from "@/lib/format";
import type { HotSpot, LayerKey, Variant } from "@/lib/types";

interface Props {
  variant: Variant;
  layers: Record<LayerKey, boolean>;
  /** Odcinek podświetlony z listy odcinków, np. "A2". */
  highlight: string | null;
  onVariant: (v: Variant) => void;
  onHotspot: (h: HotSpot) => void;
}

/** Deterministyczny generator tła mapy (to samo ziarno co w wersji HTML). */
function useBackground(layers: Record<LayerKey, boolean>) {
  return useMemo(() => {
    let rnd = 7;
    const R = () => {
      rnd = (rnd * 9301 + 49297) % 233280;
      return rnd / 233280;
    };
    const fields: { x: number; y: number; w: number; h: number; o: number }[] = [];
    for (let x = 0; x < 800; x += 80)
      for (let y = 0; y < 520; y += 65) {
        const w = 74,
          h = 59;
        fields.push({ x: x + 3 + R() * 4, y: y + 3 + R() * 4, w: w - R() * 8, h: h - R() * 8, o: 0.55 + R() * 0.45 });
      }
    const parcels: { x: number; y: number; w: number; h: number }[] = [];
    if (layers.egib)
      for (let i = 0; i < 46; i++) {
        const x = R() * 780,
          y = R() * 500;
        parcels.push({ x, y, w: 16 + R() * 30, h: 10 + R() * 22 });
      }
    const houses: { x: number; y: number; w: number; h: number; rot: number }[] = [];
    if (layers.bdot)
      VILLAGES.forEach(([cx, cy]) => {
        for (let i = 0; i < 26; i++) {
          const x = cx + (R() - 0.5) * 150,
            y = cy + (R() - 0.5) * 90;
          houses.push({ x, y, w: 7 + R() * 6, h: 6 + R() * 5, rot: R() * 30 - 15 });
        }
      });
    return { fields, parcels, houses };
  }, [layers.egib, layers.bdot]);
}

const VILLAGES: [number, number, string][] = [
  [260, 350, "Brzozowa"],
  [560, 330, "Lipnik"],
];

const STREAM = "M300 0C360 150 330 260 410 330S470 470 430 520";

/** Poglądowa mapa trasy z GCI odcinków i punktami zapalnymi. */
export function RouteMap({ variant, layers, highlight, onVariant, onHotspot }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null);
  const bg = useBackground(layers);

  const moveTip = (e: React.MouseEvent) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    setTip((t) => (t ? { ...t, x: e.clientX - r.left, y: e.clientY - r.top } : t));
  };

  const segments = (k: Variant) => {
    const r = ROUTES[k];
    const act = variant === k;
    return (
      <g key={k}>
        {r.pts.slice(0, -1).map((a, i) => {
          const b = r.pts[i + 1];
          const id = `${k}${i}`;
          const width = act ? (highlight === id ? 12 : hover === id ? 11 : 7) : 4;
          return (
            <line
              key={id}
              className="seg-path"
              x1={a[0]}
              y1={a[1]}
              x2={b[0]}
              y2={b[1]}
              stroke={act ? gciColor(r.gci[i]) : "var(--fg-3)"}
              strokeWidth={width}
              strokeLinecap="round"
              opacity={act ? 1 : 0.45}
              strokeDasharray={act ? undefined : "2 9"}
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) => {
                const rect = wrap.current?.getBoundingClientRect();
                setHover(id);
                setTip({ text: `Wariant ${k} · odcinek ${i + 1} · GCI ${r.gci[i]} · ${SEGMENT_NAMES[k][i]}`, x: rect ? e.clientX - rect.left : 0, y: rect ? e.clientY - rect.top : 0 });
              }}
              onMouseMove={moveTip}
              onMouseLeave={() => {
                setHover(null);
                setTip(null);
              }}
              onClick={() => {
                if (k !== variant) onVariant(k);
              }}
            />
          );
        })}
        {act &&
          r.pts.map((p, i) => (i && i < r.pts.length - 1 ? <circle key={i} cx={p[0]} cy={p[1]} r={4} fill="var(--surface)" stroke={gciColor(r.gci[i])} strokeWidth={2} /> : null))}
      </g>
    );
  };

  const other: Variant = variant === "A" ? "B" : "A";

  return (
    <div className="map" ref={wrap}>
      <svg viewBox="0 0 800 520" role="img" aria-label="Mapa trasy z hot-spotami GCI">
        <defs>
          <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="8" fill="color-mix(in srgb,var(--fg) 5%,transparent)" />
            <line x1="0" y1="0" x2="0" y2="8" stroke="var(--green)" strokeWidth="2" opacity=".45" />
          </pattern>
        </defs>
        <rect width="800" height="520" fill="var(--map-bg)" />
        {layers.orto && <rect width="800" height="520" fill="#6E7F55" opacity=".25" />}
        {bg.fields.map((f, i) => (
          <rect key={i} x={f.x} y={f.y} width={f.w} height={f.h} rx="3" fill="var(--map-field)" opacity={f.o} />
        ))}
        {bg.parcels.map((p, i) => (
          <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} fill="none" stroke="var(--map-line)" strokeWidth="1" />
        ))}
        {layers.n2k && (
          <>
            <path d="M350 180L470 160L525 232L470 305L380 322L330 262Z" fill="url(#hatch)" stroke="var(--fg-3)" strokeWidth="1.5" strokeDasharray="6 4" />
            <text x="430" y="200" fontSize="11" fontWeight="600" fill="var(--fg-2)">
              Natura 2000 · obszar siedliskowy
            </text>
          </>
        )}
        {layers.isok && (
          <>
            <path d={STREAM} fill="none" stroke="var(--water)" strokeWidth="54" opacity=".18" strokeLinecap="round" />
            <text x="468" y="470" fontSize="10.5" fontWeight="600" fill="var(--water)">
              ISOK · obszar Q1%
            </text>
          </>
        )}
        {layers.cieki && (
          <>
            <path d={STREAM} fill="none" stroke="var(--water)" strokeWidth="7" strokeLinecap="round" />
            <text x="318" y="120" fontSize="11" fill="var(--water)" fontStyle="italic" transform="rotate(68 318 120)">
              potok Brzozówka
            </text>
          </>
        )}
        <path d="M0 472L800 382" stroke="#fff" strokeWidth="9" opacity=".9" />
        <path d="M0 472L800 382" stroke="var(--road)" strokeWidth="5" />
        <text x="20" y="460" fontSize="10.5" fill="var(--fg-2)" fontWeight="600">
          DW
        </text>
        <path d="M0 300L800 100" stroke="var(--fg-2)" strokeWidth="4" />
        <path d="M0 300L800 100" stroke="var(--map-bg)" strokeWidth="2" strokeDasharray="8 8" />
        <text x="740" y="104" fontSize="10.5" fill="var(--fg-2)" fontWeight="600">
          PKP
        </text>
        {layers.gesut && (
          <>
            <path d="M150 360L420 360" stroke="#7B61FF" strokeWidth="2" strokeDasharray="3 3" opacity=".7" />
            <path d="M230 300L330 420" stroke="#E5484D" strokeWidth="2" strokeDasharray="3 3" opacity=".6" />
          </>
        )}
        {bg.houses.map((h, i) => (
          <rect key={i} x={h.x} y={h.y} width={h.w} height={h.h} rx="1" fill="var(--fg-3)" opacity=".45" transform={`rotate(${h.rot} ${h.x} ${h.y})`} />
        ))}
        {VILLAGES.map(([x, y, n]) => (
          <text key={n} x={x} y={y - 52} fontSize="12.5" fontWeight="700" fill="var(--fg)" textAnchor="middle">
            {n}
          </text>
        ))}
        {segments(other)}
        {segments(variant)}
        <rect x="690" y="72" width="22" height="22" rx="5" fill="var(--ink)" />
        <text x="701" y="87" fontSize="10" fill="var(--on-ink)" textAnchor="middle" fontWeight="700">
          O
        </text>
        <text x="716" y="68" fontSize="11" fill="var(--fg-2)">
          oczyszczalnia
        </text>
        <circle cx="80" cy="430" r="7" fill="var(--surface)" stroke="var(--ink)" strokeWidth="3" />
        {layers.hs &&
          variant === "A" &&
          HOTSPOTS.map((h) => (
            <g key={h.n} className="hs" onClick={() => onHotspot(h)} role="button" aria-label={`Punkt zapalny ${h.n}: ${h.t}`}>
              <circle className="pulse" cx={h.x} cy={h.y} r="14" fill={gciColor(h.g)} />
              <circle cx={h.x} cy={h.y} r="13" fill={gciColor(h.g)} stroke="#fff" strokeWidth="2.5" />
              <text x={h.x} y={h.y + 4.5} fontSize="12" fontWeight="700" fill="#fff" textAnchor="middle">
                {h.n}
              </text>
            </g>
          ))}
      </svg>
      <div className="legend">
        <span><i style={{ background: "var(--green)" }} />&lt; 40</span>
        <span><i style={{ background: "#E0B12B" }} />40–54</span>
        <span><i style={{ background: "var(--orange)" }} />55–69</span>
        <span><i style={{ background: "var(--red)" }} />≥ 70</span>
        <span className="faint">GCI odcinka</span>
      </div>
      <div className="tip" style={{ opacity: tip ? 1 : 0, left: tip?.x ?? 0, top: tip?.y ?? 0 }}>
        {tip?.text}
      </div>
    </div>
  );
}
