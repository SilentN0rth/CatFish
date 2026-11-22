import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import { AppStateProvider } from "@/lib/state";
import { AppShell } from "@/components/shell/AppShell";
import "./globals.css";

const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-geist", weight: ["400", "500", "600", "700"] });
const geistMono = Geist_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-geist-mono", weight: ["500"] });

export const metadata: Metadata = {
  title: "GeoWATER Risk",
  description: "Prototyp Risk Miner dla sieci wod-kan: indeks złożoności terenowej GCI, ryzyka R02–R04, panel eksperta. Dane testowe.",
  icons: { icon: "/img/risk-miner-znak.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <MotionConfig reducedMotion="user">
          <AppStateProvider>
            <AppShell>{children}</AppShell>
          </AppStateProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
