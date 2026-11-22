import { notFound } from "next/navigation";
import { SCREENS, TITLES, isScreen } from "@/lib/routes";
import { ScreenView } from "@/components/screens/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return SCREENS.map((screen) => ({ screen }));
}

export async function generateMetadata({ params }: { params: Promise<{ screen: string }> }) {
  const { screen } = await params;
  return { title: isScreen(screen) ? `${TITLES[screen]} · GeoWATER Risk` : "GeoWATER Risk" };
}

export default async function ScreenPage({ params }: { params: Promise<{ screen: string }> }) {
  const { screen } = await params;
  if (!isScreen(screen)) notFound();
  return <ScreenView screen={screen} />;
}
