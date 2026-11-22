"use client";

import { AnimatePresence, motion } from "motion/react";
import { TASKS } from "@/data/work";
import { isScreen } from "@/lib/routes";
import { useApp, type AppState } from "@/lib/state";
import type { Task, TaskPriority } from "@/lib/types";
import { CheckBox, Chip, ScreenHead, Seg } from "@/components/ui/primitives";
import { EASE, Kpi, Screen } from "@/components/ui/motion";

const TONE: Record<TaskPriority, "red" | "orange" | ""> = { wysoki: "red", średni: "orange", niski: "" };

export function Kolejka() {
  const { s, update, toast, go, openProject, openBeneficiary, pending } = useApp();
  const f = s.qt;
  const list = TASKS.filter((t) => f === "wszystkie" || t.kiedy === f);
  const open = TASKS.filter((t) => !s.done[t.id]).length;

  const openTask = (t: Task) => {
    if (t.p.startsWith("RM-") && t.go === "projekt") openProject(t.p);
    else if (t.go === "beneficjent") openBeneficiary(t.p);
    else if (isScreen(t.go)) go(t.go);
  };

  return (
    <Screen>
      <ScreenHead eyebrow="Moja praca" title="Co jest dziś do zrobienia" sub="Zadania układamy według terminu i tego, ile może kosztować błąd. Każde prowadzi prosto do miejsca, w którym je załatwisz.">
        <Seg<AppState["qt"]>
          value={f}
          options={[["dzis", "Dziś"], ["tydz", "Ten tydzień"], ["pozn", "Później"], ["wszystkie", "Wszystkie"]]}
          onChange={(v) =>
            update((d) => {
              d.qt = v;
            })
          }
        />
      </ScreenHead>

      <div className="grid g4">
        <Kpi label="Otwarte zadania" value={open} desc={`z ${TASKS.length} w kolejce`} />
        <Kpi label="Na dziś" value={TASKS.filter((t) => t.kiedy === "dzis").length} desc="w tym 2 o wysokim priorytecie" />
        <Kpi label="Możliwe korekty" value="99 070 zł" valueClass="num text-[28px]" desc="w 2 projektach, szacunek" onClick={() => go("projekt")} />
        <Kpi label="Czeka na eksperta" value={pending} desc="wnioski do zatwierdzenia" onClick={() => go("ekspert")} />
      </div>

      <div className="card">
        <AnimatePresence initial={false} mode="popLayout">
          {list.length ? (
            list.map((t) => {
              const done = !!s.done[t.id];
              return (
                <motion.div
                  key={t.id}
                  layout
                  className="list-row cursor-default items-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: done ? 0.5 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <CheckBox
                    checked={done}
                    className="mt-0.5"
                    label={t.t}
                    onChange={(v) => {
                      update((d) => {
                        d.done[t.id] = v;
                      });
                      toast(v ? "Zadanie oznaczone jako zrobione" : "Zadanie wróciło do kolejki");
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="row justify-between gap-2">
                      <b className={done ? "line-through" : ""}>{t.t}</b>
                      <Chip tone={TONE[t.pr]}>{t.pr}</Chip>
                    </div>
                    <p className="muted mt-[3px] text-[13px]">{t.w}</p>
                    <div className="faint mt-1 text-[12px]">
                      {t.d} · {t.p}
                    </div>
                  </div>
                  <button className="btn secondary sm" onClick={() => openTask(t)}>
                    Otwórz
                  </button>
                </motion.div>
              );
            })
          ) : (
            <div className="card-b faint">Nic tu nie ma.</div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  );
}
