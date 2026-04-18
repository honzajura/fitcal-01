"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { StepperInput } from "@/components/ui/stepper-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Mars, Venus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ACTIVITY_MULTIPLIERS = {
  sedentary: { label: "Sedentary (office job)", value: 1.2 },
  light: { label: "Lightly active (1–3 days/week)", value: 1.375 },
  moderate: { label: "Moderately active (3–5 days/week)", value: 1.55 },
  active: { label: "Very active (6–7 days/week)", value: 1.725 },
  extra: { label: "Extra active (physical job or 2× training)", value: 1.9 },
};

type ActivityKey = keyof typeof ACTIVITY_MULTIPLIERS;
type Sex = "male" | "female";
type Unit = "metric" | "imperial";

function calcBMR(weight: number, height: number, age: number, sex: Sex) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export default function TdeeCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(10);
  const [activity, setActivity] = useState<ActivityKey>("sedentary");
  const [useBodyFat, setUseBodyFat] = useState(false);
  const [bodyFat, setBodyFat] = useState(20);

  let result: { bmr: number; tdee: number } | null = null;
  {
    let weightKg = unit === "imperial" ? weight * 0.453592 : weight;
    let heightCm = unit === "imperial" ? (heightFt * 12 + heightIn) * 2.54 : height;

    if (age > 0 && weightKg > 0 && heightCm > 0) {
      const effectiveWeight = useBodyFat && bodyFat > 0
        ? weightKg * (1 - bodyFat / 100)
        : weightKg;
      const bmr = calcBMR(effectiveWeight, heightCm, age, sex);
      const tdee = bmr * ACTIVITY_MULTIPLIERS[activity].value;
      result = { bmr: Math.round(bmr), tdee: Math.round(tdee) };
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 grid gap-8 md:grid-cols-[1fr_360px]">

      <div className="space-y-6 min-w-0">

      {/* Unit toggle */}
      <div className="flex w-full bg-muted rounded-[12px] p-1 gap-1">
        {(["metric", "imperial"] as Unit[]).map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={`flex-1 rounded-[8px] py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted ${
              unit === u
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {u === "metric" ? "Metric (kg, cm)" : "Imperial (lbs, in)"}
          </button>
        ))}
      </div>

      {/* Gender + Age */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Gender</Label>
          <div className="flex gap-2">
            {(["male", "female"] as Sex[]).map((s) => (
              <button
                key={s}
                onClick={() => setSex(s)}
                className={`flex-1 flex items-center justify-center rounded-[12px] border h-[66px] text-xl transition-colors ${
                  sex === s
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
                aria-label={s}
              >
                {s === "male" ? <Mars className="w-6 h-6" strokeWidth={2} /> : <Venus className="w-6 h-6" strokeWidth={2} />}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Age</Label>
          <StepperInput value={age} onChange={setAge} min={10} max={100} />
        </div>
      </div>

      {/* Height + Weight */}
      {unit === "metric" ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Height (cm)</Label>
            <StepperInput value={height} onChange={setHeight} min={100} max={250} />
          </div>
          <div className="space-y-1.5">
            <Label>Weight (kg)</Label>
            <StepperInput value={weight} onChange={setWeight} min={20} max={300} step={0.5} decimals={1} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Height (ft)</Label>
              <StepperInput value={heightFt} onChange={setHeightFt} min={3} max={8} />
            </div>
            <div className="space-y-1.5">
              <Label>Inches</Label>
              <StepperInput value={heightIn} onChange={setHeightIn} min={0} max={11} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Weight (lbs)</Label>
            <StepperInput value={weight} onChange={setWeight} min={44} max={660} step={0.5} decimals={1} />
          </div>
        </div>
      )}

      {/* Activity level */}
      <div className="space-y-1.5">
        <Label>Activity level</Label>
        <Select value={activity} onValueChange={(v) => setActivity(v as ActivityKey)}>
          <SelectTrigger className="w-full bg-card border border-border rounded-[12px] px-4 ![height:66px] text-base">
            <SelectValue>{ACTIVITY_MULTIPLIERS[activity].label}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Body fat % */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="use-bodyfat"
            checked={useBodyFat}
            onCheckedChange={(v) => setUseBodyFat(!!v)}
            className="size-6 rounded-[8px] [&_svg]:!size-5"
          />
          <Label htmlFor="use-bodyfat" className="cursor-pointer">
            Include body fat % <span className="text-muted-foreground">(more accurate)</span>
          </Label>
        </div>
        {useBodyFat && (
          <div className="max-w-[200px]">
            <StepperInput value={bodyFat} onChange={setBodyFat} min={3} max={60} />
          </div>
        )}
      </div>

      </div>

      {/* Results */}
      {result && (
        <div className="md:sticky md:top-8 md:self-start">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">Your results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <ResultBox label="BMR" value={result.bmr} sub="base metabolic rate" />
                <ResultBox label="TDEE" value={result.tdee} sub="maintenance calories" highlight />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ResultBox label="Cut" value={result.tdee - 500} sub="−500 kcal/day" />
                <ResultBox label="Bulk" value={result.tdee + 500} sub="+500 kcal/day" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function ResultBox({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: number;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-3 text-center space-y-0.5 ${
        highlight
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <p className="text-xs uppercase tracking-wide font-medium">{label}</p>
      <p className={`text-3xl font-bold font-mono tabular-nums ${highlight ? "text-primary-foreground" : "text-foreground"}`}>
        {value}
      </p>
      <p className="text-xs">{sub}</p>
    </div>
  );
}
