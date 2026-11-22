"use client";

import { useRef } from "react";
import { LLM, STATUS_DESIGNED, STATUS_WORKS, STATUS_WRITTEN, type LlmProvider } from "@/data/settings";
import { downloadText, exportData } from "@/lib/export";
import { toCSV } from "@/lib/format";
import { copyText, useApp, type ExportKind } from "@/lib/state";
import { CardHead, Chip, ScreenHead, Seg } from "@/components/ui/primitives";
import { Screen } from "@/components/ui/motion";

export function Eksport() {
  const { s, update, toast } = useApp();
  const pre = useRef<HTMLPreElement>(null);
  const data = exportData(s);
  const fullText = s.fmt === "json" ? JSON.stringify(data, null, 2) : toCSV(data);
  const preview = s.fmt === "json" ? JSON.stringify(data.slice(0, 3), null, 2) + (data.length > 3 ? `\n/* … i ${data.length - 3} kolejnych rekordów */` : "") : toCSV(data);
  const llm = LLM[s.llm];

  return (
    <Screen>
      <ScreenHead eyebrow="Eksport" title="Eksport i ustawienia" sub="W każdym pliku zostaje informacja, czy to dane źródłowe, obliczenie czy wniosek modelu, a także skąd i kiedy pobrano dane." />

      <div className="card">
        <div className="card-h">
          <div className="row">
            <Seg<ExportKind>
              value={s.exp}
              options={[["ryzyka", "Ryzyka"], ["projekty", "Projekty"], ["jakosc", "Znaleziska jakości"], ["decyzje", "Decyzje eksperta"]]}
              onChange={(v) =>
                update((d) => {
                  d.exp = v;
                })
              }
            />
            <Seg
              value={s.fmt}
              options={[["json", "JSON"], ["csv", "CSV"]] as const}
              onChange={(v) =>
                update((d) => {
                  d.fmt = v;
                })
              }
            />
          </div>
          <div className="row">
            <span className="faint num text-[12px]">{data.length} rekordów</span>
            <button className="btn secondary sm" onClick={() => copyText(fullText, toast, pre.current)}>
              Kopiuj
            </button>
            <button
              className="btn primary sm"
              onClick={() => {
                downloadText(`georisk_${s.exp}.${s.fmt}`, fullText, s.fmt === "json" ? "application/json" : "text/csv");
                toast(`Pobrano georisk_${s.exp}.${s.fmt}`);
              }}
            >
              Pobierz .{s.fmt}
            </button>
          </div>
        </div>
        <div className="card-b">
          <pre className="code" ref={pre}>
            {preview}
          </pre>
        </div>
      </div>

      <div className="grid g2">
        <div className="card">
          <CardHead title="Model językowy" sub="Można wybrać dowolnego dostawcę albo nie używać modelu wcale. Każdą propozycję modelu oznaczamy jako „wniosek modelu” i sprawdza ją ekspert." />
          <div className="card-b stack gap-2">
            {(Object.entries(LLM) as [LlmProvider, (typeof LLM)[LlmProvider]][]).map(([k, v]) => (
              <label
                key={k}
                className="row cursor-pointer flex-nowrap items-start gap-3 rounded-xl border p-3 transition-colors"
                style={{ borderColor: s.llm === k ? "var(--blue)" : "var(--line)", background: s.llm === k ? "var(--blue-s)" : undefined }}
              >
                <input
                  type="radio"
                  name="llm"
                  value={k}
                  checked={s.llm === k}
                  className="mt-[3px] accent-[var(--blue)]"
                  onChange={() => {
                    update((d) => {
                      d.llm = k;
                    });
                    toast("Dostawca modelu: " + v.name);
                  }}
                />
                <span className="flex-1">
                  <b>{v.name}</b>
                  <span className="muted mt-0.5 block text-[12.5px]">Gdzie przetwarzane są dane: {v.where}</span>
                </span>
                <Chip tone={v.local ? "green" : "amber"}>{v.local ? "lokalnie" : "poza resortem"}</Chip>
              </label>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-h">
            <h3>Plik ustawień</h3>
            <Chip>plik przykładowy</Chip>
          </div>
          <div className="card-b">
            <pre className="code">{`llm:
  provider: ${s.llm}
  model: "${s.llm === "none" ? "" : s.llm === "ollama" ? "llama3.1:8b" : "nazwa-modelu"}"
  base_url: "${s.llm === "ollama" ? "http://localhost:11434" : s.llm === "openai_compatible" ? "https://api.dostawca.example/v1" : ""}"
  api_key_env: LLM_API_KEY   # klucza nie wpisujemy do pliku
  data_processing: >
    ${llm.where}
monitor:
  interval_seconds: 86400
bzp:
  base_url: https://bzp.cytr.us`}</pre>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <h2>Co już działa, a co jest dopiero zaprojektowane</h2>
        </div>
        <div className="grid g3 card-b gap-5">
          {(
            [
              ["green", "Działa i jest przetestowane", STATUS_WORKS],
              ["amber", "Napisane, niezweryfikowane", STATUS_WRITTEN],
              ["", "Tylko zaprojektowane", STATUS_DESIGNED],
            ] as const
          ).map(([tone, title, items]) => (
            <div key={title} className="stack gap-2">
              <Chip tone={tone} dot className="self-start">
                {title}
              </Chip>
              {items.map((t) => (
                <p key={t} className="text-[13px]">
                  {t}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}
