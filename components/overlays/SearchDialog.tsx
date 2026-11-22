"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PROJECTS } from "@/data/projects";
import { SCREENS, TITLES, type ScreenKey } from "@/lib/routes";
import { useApp } from "@/lib/state";

type Hit = { t: string; s: string; go?: ScreenKey; proj?: string };

/** Wyszukiwarka ekranów i projektów (⌘K). */
export function SearchDialog() {
  const { go, openProject } = useApp();
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const t = setTimeout(() => ref.current?.focus(), 60);
    return () => clearTimeout(t);
  }, []);

  const hits = useMemo<Hit[]>(() => {
    const needle = q.toLowerCase();
    const all: Hit[] = [
      ...SCREENS.filter((k) => k !== "analiza").map((k) => ({ t: TITLES[k], s: "Ekran", go: k })),
      ...PROJECTS.map((p) => ({ t: p.nm, s: `${p.id} · ${p.gm} · ${p.pub}`, proj: p.id })),
    ];
    return all.filter((x) => !needle || (x.t + x.s).toLowerCase().includes(needle)).slice(0, 9);
  }, [q]);

  return (
    <div className="sh-b gap-2.5">
      <input ref={ref} className="input h-11 text-[15px]" placeholder="Szukaj projektu, NIP, numeru KPO lub ekranu…" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="flex max-h-[360px] flex-col gap-0.5 overflow-auto">
        {hits.length ? (
          hits.map((x) => (
            <button key={x.t + x.s} className="nav flex-col items-start gap-0" onClick={() => (x.proj ? openProject(x.proj) : x.go && go(x.go))}>
              <span className="text-fg">{x.t}</span>
              <span className="faint text-[12px]">{x.s}</span>
            </button>
          ))
        ) : (
          <p className="faint p-2.5">Nie znaleziono w przeanalizowanych źródłach.</p>
        )}
      </div>
    </div>
  );
}
