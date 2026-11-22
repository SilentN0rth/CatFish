import type { ReactNode } from "react";
import { IconCheck } from "./icons";

/**
 * Lista kroków z animacją postępu.
 * `tick` rośnie o 2 na krok: nieparzysty = krok w toku, parzysty = krok zakończony.
 */
export function ProgressSteps({ steps, tick }: { steps: ReactNode[]; tick: number }) {
  return (
    <div className="progress-steps">
      {steps.map((s, i) => {
        const state = tick >= i * 2 + 2 ? "done" : tick === i * 2 + 1 ? "run" : "";
        return (
          <div key={i} className={state}>
            <span className="ic">
              <IconCheck />
            </span>
            {s}
          </div>
        );
      })}
    </div>
  );
}
