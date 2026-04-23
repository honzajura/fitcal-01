import TdeeCalculator from "@/components/tdee-calculator";
import { Hero } from "@/components/hero";
import { HowTdeeIsCalculated } from "@/components/how-tdee-is-calculated";

export default function Home() {
  return (
    <main className="min-h-dvh bg-background flex flex-col items-center justify-start">
      <Hero />
      <TdeeCalculator />
      <HowTdeeIsCalculated />
    </main>
  );
}
