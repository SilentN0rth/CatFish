"use client";

import type { ComponentType } from "react";
import type { ScreenKey } from "@/lib/routes";
import { Pulpit } from "./Pulpit";
import { Kolejka } from "./Kolejka";
import { Nowa } from "./Nowa";
import { Analiza } from "./Analiza";
import { Teren } from "./Teren";
import { Projekt } from "./Projekt";
import { Beneficjent } from "./Beneficjent";
import { Zrodla } from "./Zrodla";
import { Zbieranie } from "./Zbieranie";
import { Jakosc } from "./Jakosc";
import { Sloty } from "./Sloty";
import { Monitoring } from "./Monitoring";
import { Ekspert } from "./Ekspert";
import { Kalibracja } from "./Kalibracja";
import { Raporty } from "./Raporty";
import { Eksport } from "./Eksport";

const SCREEN_COMPONENTS: Record<ScreenKey, ComponentType> = {
  pulpit: Pulpit,
  kolejka: Kolejka,
  nowa: Nowa,
  analiza: Analiza,
  teren: Teren,
  projekt: Projekt,
  beneficjent: Beneficjent,
  zrodla: Zrodla,
  zbieranie: Zbieranie,
  jakosc: Jakosc,
  sloty: Sloty,
  monitoring: Monitoring,
  ekspert: Ekspert,
  kalibracja: Kalibracja,
  raporty: Raporty,
  eksport: Eksport,
};

export function ScreenView({ screen }: { screen: ScreenKey }) {
  const C = SCREEN_COMPONENTS[screen];
  return <C />;
}
