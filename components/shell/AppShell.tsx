"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NAVMAP, TITLES, isScreen, type ScreenKey } from "@/lib/routes";
import { useApp } from "@/lib/state";
import { IconBell, IconCheck, IconMenu, IconSearch, NavIcons } from "@/components/ui/icons";
import { EASE } from "@/components/ui/motion";
import { OverlayHost } from "@/components/overlays/OverlayHost";

const NAV: { group: string; items: { k: ScreenKey; n: string }[] }[] = [
  {
    group: "Analiza",
    items: [
      { k: "pulpit", n: "Pulpit" },
      { k: "kolejka", n: "Moja praca" },
      { k: "nowa", n: "Nowa inwestycja" },
      { k: "teren", n: "Teren i warianty trasy" },
      { k: "projekt", n: "Projekty" },
    ],
  },
  {
    group: "Dane",
    items: [
      { k: "zrodla", n: "Źródła" },
      { k: "zbieranie", n: "Zbieranie danych" },
      { k: "jakosc", n: "Jakość danych" },
      { k: "sloty", n: "Sloty danych" },
      { k: "monitoring", n: "Monitoring" },
    ],
  },
  {
    group: "Kontrola",
    items: [
      { k: "ekspert", n: "Panel eksperta" },
      { k: "kalibracja", n: "Kalibracja" },
      { k: "raporty", n: "Raporty" },
      { k: "eksport", n: "Eksport i ustawienia" },
    ],
  },
];

function useCurrentScreen(): ScreenKey {
  const path = usePathname() ?? "/pulpit";
  const k = path.split("/")[1] ?? "";
  return isScreen(k) ? k : "pulpit";
}

function Sidebar() {
  const { pending, menuOpen, setMenuOpen } = useApp();
  const current = useCurrentScreen();
  const active = NAVMAP[current] ?? current;
  return (
    <aside className={`sb ${menuOpen ? "open" : ""}`} aria-label="Nawigacja główna">
      <div className="brand">
        <Image src="/img/risk-miner-znak.png" alt="Znak Risk Miner" width={40} height={40} priority />
        <div>
          <b>GeoWATER Risk</b>
          <span>Risk Miner · wod-kan</span>
        </div>
      </div>
      {NAV.map((g) => (
        <div key={g.group} className="contents">
          <div className="grp eyebrow">{g.group}</div>
          {g.items.map((it) => (
            <Link key={it.k} href={`/${it.k}`} className="nav" aria-current={active === it.k ? "page" : undefined} onClick={() => setMenuOpen(false)}>
              {NavIcons[it.k as keyof typeof NavIcons]}
              {it.n}
              {it.k === "monitoring" && <span className="dot" />}
              {it.k === "ekspert" && pending > 0 && (
                <motion.span key={pending} className="badge" initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 22 }}>
                  {pending}
                </motion.span>
              )}
            </Link>
          ))}
        </div>
      ))}
      <div className="rule">
        <b>Człowiek decyduje</b>
        <p>Narzędzie wskazuje sygnały i ich źródła. Nie ocenia zgodności z prawem i nie wydaje decyzji administracyjnych.</p>
      </div>
      <div className="gov">
        <Image src="/img/mfipr.png" alt="Ministerstwo Funduszy i Polityki Regionalnej" width={190} height={58} className="h-auto" />
      </div>
    </aside>
  );
}

function Topbar() {
  const { open, go, menuOpen, setMenuOpen } = useApp();
  const current = useCurrentScreen();
  return (
    <header className="top">
      <button className="icon-btn menu-btn" aria-label="Otwórz menu" onClick={() => setMenuOpen(!menuOpen)}>
        <IconMenu />
      </button>
      <div className="crumbs">
        GeoWATER Risk <span>/</span> <b>{TITLES[current]}</b>
      </div>
      <button className="search" aria-label="Szukaj" onClick={() => open({ name: "szukaj" })}>
        <IconSearch />
        <span>Szukaj projektu, NIP, numeru KPO…</span>
        <kbd>⌘K</kbd>
      </button>
      <span className="proto">Prototyp · dane testowe</span>
      <button className="icon-btn" aria-label="Ostrzeżenia" onClick={() => go("monitoring")}>
        <IconBell />
        <span className="pip" />
      </button>
      <div className="avatar" title="Opiekun umowy, MFiPR">
        OU
      </div>
    </header>
  );
}

function Toast() {
  const { toastMsg } = useApp();
  return (
    <AnimatePresence>
      {toastMsg && (
        <motion.div
          key={toastMsg.id}
          className="toast"
          role="status"
          initial={{ opacity: 0, y: 16, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 16, x: "-50%" }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <IconCheck />
          <span>{toastMsg.msg}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Skróty klawiszowe: ⌘K / Ctrl+K – wyszukiwarka, Esc – zamknięcie nakładki. */
function Shortcuts() {
  const { open, close } = useApp();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open({ name: "szukaj" });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);
  return null;
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="app">
        <Sidebar />
        <div className="main">
          <Topbar />
          <main className="view" aria-live="polite">
            {children}
          </main>
        </div>
      </div>
      <OverlayHost />
      <Toast />
      <Shortcuts />
    </>
  );
}
