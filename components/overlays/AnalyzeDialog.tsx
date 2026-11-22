"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/state";
import { ProgressSteps } from "@/components/ui/ProgressSteps";

const STEPS = [
  "Klasyfikacja podsektora i rodzaju prac",
  "Porównanie z bazą 22 projektów",
  "Liczenie GCI z 6 wymiarów",
  "Ryzyka i flagi z podobieństwa",
  "Realność harmonogramu i rekomendacje",
];
const STEP_MS = 420;

/** Okno postępu analizy nowej inwestycji; po zakończeniu przechodzi do wyniku. */
export function AnalyzeDialog() {
  const { go } = useApp();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setTick(i * 2 + 1), i * STEP_MS));
      timers.push(setTimeout(() => setTick(i * 2 + 2), i * STEP_MS + 380));
    });
    timers.push(setTimeout(() => go("analiza"), STEPS.length * STEP_MS + 250));
    return () => timers.forEach(clearTimeout);
  }, [go]);
  return (
    <>
      <div className="sh-h">
        <div>
          <div className="eyebrow">Moduł 2</div>
          <h2 className="mt-1.5">Analizuję inwestycję</h2>
        </div>
      </div>
      <div className="sh-b">
        <ProgressSteps steps={STEPS} tick={tick} />
      </div>
    </>
  );
}
