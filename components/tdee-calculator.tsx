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
  sedentary: { name: "Sedentary", detail: "office job", value: 1.2 },
  light: { name: "Lightly active", detail: "1–3 days/week", value: 1.375 },
  moderate: { name: "Moderately active", detail: "3–5 days/week", value: 1.55 },
  active: { name: "Very active", detail: "6–7 days/week", value: 1.725 },
  extra: { name: "Extra active", detail: "physical job or 2× training", value: 1.9 },
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
    <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-8 grid gap-8 md:grid-cols-[1fr_420px]">

      <div className="space-y-6 min-w-0">

      {/* Unit toggle */}
      <div className="flex">
        {(["metric", "imperial"] as Unit[]).map((u, i) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={`flex-1 flex items-center justify-center border h-10 text-sm font-medium transition-[transform,background-color,color,border-color] active:scale-[0.97] ${
              i === 0 ? "rounded-l-[10px] rounded-r-none" : "rounded-r-[10px] rounded-l-none -ml-px"
            } ${
              unit === u
                ? "bg-foreground text-background border-foreground relative z-10 dark:bg-foreground/85 dark:border-foreground/85"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {u === "metric" ? (
              <>Metric<span className="font-normal opacity-70 ml-1.5">(kg, cm)</span></>
            ) : (
              <>Imperial<span className="font-normal opacity-70 ml-1.5">(lbs, in)</span></>
            )}
          </button>
        ))}
      </div>

      {/* Gender + Age */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="ml-1">Gender</Label>
          <div className="flex">
            {(["male", "female"] as Sex[]).map((s, i) => (
              <button
                key={s}
                onClick={() => setSex(s)}
                className={`group flex-1 flex items-center justify-center border h-[56px] text-xl transition-[transform,background-color,color,border-color] active:scale-[0.97] ${
                  i === 0 ? "rounded-l-[12px] rounded-r-none" : "rounded-r-[12px] rounded-l-none -ml-px"
                } ${
                  sex === s
                    ? "bg-foreground text-background border-foreground relative z-10 dark:bg-foreground/85 dark:border-foreground/85"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
                aria-label={s}
              >
                {s === "male"
                  ? <Mars className="size-6 transition-transform [@media(hover:hover)]:group-hover:scale-110" strokeWidth={2} />
                  : <Venus className="size-6 transition-transform [@media(hover:hover)]:group-hover:scale-110" strokeWidth={2} />}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="ml-1">Age</Label>
          <StepperInput value={age} onChange={setAge} min={10} max={100} />
        </div>
      </div>

      {/* Height + Weight */}
      {unit === "metric" ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="ml-1"><span>Height <span className="font-normal text-muted-foreground">(cm)</span></span></Label>
            <StepperInput value={height} onChange={setHeight} min={100} max={250} />
          </div>
          <div className="space-y-1.5">
            <Label className="ml-1"><span>Weight <span className="font-normal text-muted-foreground">(kg)</span></span></Label>
            <StepperInput value={weight} onChange={setWeight} min={20} max={300} step={0.5} decimals={1} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="ml-1"><span>Height <span className="font-normal text-muted-foreground">(ft)</span></span></Label>
              <StepperInput value={heightFt} onChange={setHeightFt} min={3} max={8} />
            </div>
            <div className="space-y-1.5">
              <Label className="ml-1">Inches</Label>
              <StepperInput value={heightIn} onChange={setHeightIn} min={0} max={11} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="ml-1"><span>Weight <span className="font-normal text-muted-foreground">(lbs)</span></span></Label>
            <StepperInput value={weight} onChange={setWeight} min={44} max={660} step={0.5} decimals={1} />
          </div>
        </div>
      )}

      {/* Activity level */}
      <div className="space-y-1.5">
        <Label className="ml-1">Activity level</Label>
        <Select value={activity} onValueChange={(v) => setActivity(v as ActivityKey)}>
          <SelectTrigger className="w-full bg-card border border-border rounded-[12px] px-4 ![height:56px] text-base">
            <SelectValue>
              {ACTIVITY_MULTIPLIERS[activity].name}{" "}
              <span className="font-normal text-muted-foreground">({ACTIVITY_MULTIPLIERS[activity].detail})</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, { name, detail }]) => (
              <SelectItem key={key} value={key}>
                <span>{name} <span className="font-normal text-muted-foreground">({detail})</span></span>
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
            <span>Include body fat % <span className="font-normal text-muted-foreground">(more accurate)</span></span>
          </Label>
        </div>
        {useBodyFat && (
          <div className="max-w-[200px] animate-in fade-in-0 slide-in-from-top-1 duration-150">
            <StepperInput value={bodyFat} onChange={setBodyFat} min={3} max={60} />
          </div>
        )}
      </div>

      </div>

      {/* Results */}
      {result && (
        <div className="md:sticky md:top-8 md:self-start animate-in fade-in-0 zoom-in-95 duration-300">
          <Card className="py-6 ring-foreground/20">
            <CardHeader className="px-6 pb-2">
              <CardTitle className="text-lg font-semibold tracking-tight">Your results</CardTitle>
            </CardHeader>
            <CardContent className="px-6 space-y-3">
              <ResultRow label="TDEE" sub="Maintenance calories" value={result.tdee} highlight delay={0} />
              <ResultRow label="BMR" sub="Base metabolic rate" value={result.bmr} delay={60} />
              <ResultRow label="Cut" sub="−500 kcal/day" value={result.tdee - 500} delay={120} />
              <ResultRow label="Bulk" sub="+500 kcal/day" value={result.tdee + 500} delay={180} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function ResultRow({
  label,
  sub,
  value,
  highlight,
  delay = 0,
}: {
  label: string;
  sub: string;
  value: number;
  highlight?: boolean;
  delay?: number;
}) {
  return (
    <div
      className={`rounded-[8px] px-4 py-3.5 flex items-center justify-between animate-in fade-in-0 slide-in-from-bottom-2 duration-200 ${
        highlight ? "bg-primary text-primary-foreground" : "bg-muted"
      }`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div>
        <p className={`text-base font-bold uppercase tracking-wide ${highlight ? "text-primary-foreground" : "text-foreground"}`}>
          {label}
        </p>
        <p className={`text-sm font-medium ${highlight ? "text-primary-foreground" : "text-muted-foreground"}`}>
          {sub}
        </p>
      </div>
      <div className="flex items-baseline gap-1.5">
        <p
          key={value}
          className={`text-3xl font-bold font-mono tabular-nums animate-in fade-in-0 zoom-in-95 duration-150 ${highlight ? "text-primary-foreground" : "text-foreground"}`}
        >
          {value}
        </p>
        <span className={`text-sm ${highlight ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
          kcal
        </span>
      </div>
    </div>
  );
}
