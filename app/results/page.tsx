import type { Metadata } from "next";
import { ResultsClient } from "@/components/results/results-client";

export const metadata: Metadata = {
  title: "Your Results — FitCal",
};

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function ResultsPage({ searchParams }: { searchParams: SearchParams }) {
  const p = await searchParams;
  return (
    <ResultsClient
      initialAge={parseInt(p.age ?? "25")}
      initialWeight={parseFloat(p.weight ?? "70")}
      initialHeight={parseInt(p.height ?? "175")}
      initialHeightFt={parseInt(p.heightFt ?? "5")}
      initialHeightIn={parseInt(p.heightIn ?? "10")}
      initialSex={(p.sex as "male" | "female") ?? "male"}
      initialActivity={p.activity ?? "sedentary"}
      initialUnit={(p.unit as "metric" | "imperial") ?? "metric"}
    />
  );
}
