import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { viewBox: "0 0 24 24", fill: "none", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const IconDoc = (p: P) => (<svg {...base} {...p}><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" /><path d="M14 3v5h5" /></svg>);
export const IconCalc = (p: P) => (<svg {...base} {...p}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 7h6M9 12h1M14 12h1M9 16h1M14 16h1" /></svg>);
export const IconLink = (p: P) => (<svg {...base} {...p}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>);
/** Strzałka w przyciskach – jedyna ikona widoczna wewnątrz .btn */
export const IconArrow = (p: P) => (<svg className="ar" {...base} strokeWidth={2} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const IconCheck = (p: P) => (<svg {...base} strokeWidth={2.4} {...p}><path d="m5 12 5 5 9-10" /></svg>);
export const IconX = (p: P) => (<svg {...base} strokeWidth={2} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const IconInfo = (p: P) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>);
export const IconWarn = (p: P) => (<svg {...base} {...p}><path d="M12 4 2.5 20h19z" /><path d="M12 10v4M12 17h.01" /></svg>);
export const IconStop = (p: P) => (<svg {...base} {...p}><path d="M8 3h8l5 5v8l-5 5H8l-5-5V8z" /><path d="M12 8v5M12 16h.01" /></svg>);
export const IconMenu = (p: P) => (<svg {...base} strokeWidth={2} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
export const IconSearch = (p: P) => (<svg {...base} strokeWidth={2} width={15} height={15} stroke="currentColor" {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>);
export const IconBell = (p: P) => (<svg {...base} {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0" /></svg>);

/* Ikony nawigacji */
export const NavIcons = {
  pulpit: <svg {...base} strokeWidth={1.75}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>,
  kolejka: <svg {...base} strokeWidth={1.75}><path d="M9 6h11M9 12h11M9 18h11" /><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2" /></svg>,
  nowa: <svg {...base} strokeWidth={1.75}><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></svg>,
  teren: <svg {...base} strokeWidth={1.75}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" /></svg>,
  projekt: <svg {...base} strokeWidth={1.75}><path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /></svg>,
  zrodla: <svg {...base} strokeWidth={1.75}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></svg>,
  zbieranie: <svg {...base} strokeWidth={1.75}><ellipse cx="12" cy="5.5" rx="8" ry="2.5" /><path d="M4 5.5v13c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-13M4 12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5" /></svg>,
  jakosc: <svg {...base} strokeWidth={1.75}><path d="M12 3 4 6v6c0 4.5 3.4 8.2 8 9 4.6-.8 8-4.5 8-9V6z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></svg>,
  sloty: <svg {...base} strokeWidth={1.75}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></svg>,
  monitoring: <svg {...base} strokeWidth={1.75}><path d="M3 12h4l3-8 4 16 3-8h4" /></svg>,
  ekspert: <svg {...base} strokeWidth={1.75}><circle cx="9" cy="8" r="4" /><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7M16 11l2 2 4-4" /></svg>,
  kalibracja: <svg {...base} strokeWidth={1.75}><path d="M4 18a8 8 0 1 1 16 0" /><path d="m12 18 4-5" /><path d="M12 6v1M6.3 8.3l.7.7M17.7 8.3l-.7.7" /></svg>,
  raporty: <svg {...base} strokeWidth={1.75}><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>,
  eksport: <svg {...base} strokeWidth={1.75}><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></svg>,
} as const;

export const IconEdit = (p: P) => (<svg {...base} {...p}><path d="M4 20h4L19 9l-4-4L4 16z" /></svg>);
