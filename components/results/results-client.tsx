"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Mars, Venus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { StepperInput } from "@/components/ui/stepper-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const ACTIVITY = {
  sedentary: { name: "Sedentary",         chip: "Sedentary",    detail: "office job",                  value: 1.2 },
  light:     { name: "Lightly active",    chip: "Lightly",      detail: "1–3 days/wk",                 value: 1.375 },
  moderate:  { name: "Moderately active", chip: "Moderate",     detail: "3–5 days/wk",                 value: 1.55 },
  active:    { name: "Very active",       chip: "Very active",  detail: "6–7 days/wk",                 value: 1.725 },
  extra:     { name: "Extra active",      chip: "Extra active", detail: "physical job or 2× training", value: 1.9 },
} as const;

type ActivityKey = keyof typeof ACTIVITY;
type Sex = "male" | "female";
type Unit = "metric" | "imperial";
type Goal = "maintenance" | "cut" | "bulk";

const MACRO_STRATEGIES = [
  { key: "balanced",  label: "Balanced",     hint: "30 / 35 / 35", p: 0.30, f: 0.35, c: 0.35 },
  { key: "lowCarb",   label: "Lower carb",   hint: "35 / 40 / 25", p: 0.35, f: 0.40, c: 0.25 },
  { key: "highCarb",  label: "Higher carb",  hint: "25 / 20 / 55", p: 0.25, f: 0.20, c: 0.55 },
] as const;

function calcBMR(weightKg: number, heightCm: number, age: number, sex: Sex) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

function macros(kcal: number, s: (typeof MACRO_STRATEGIES)[number]) {
  return {
    protein: Math.round((kcal * s.p) / 4),
    fat:     Math.round((kcal * s.f) / 9),
    carbs:   Math.round((kcal * s.c) / 4),
  };
}

interface Props {
  initialAge: number;
  initialWeight: number;
  initialHeight: number;
  initialHeightFt: number;
  initialHeightIn: number;
  initialSex: Sex;
  initialActivity: string;
  initialUnit: Unit;
}

export function ResultsClient({
  initialAge, initialWeight, initialHeight,
  initialHeightFt, initialHeightIn,
  initialSex, initialActivity, initialUnit,
}: Props) {
  const router = useRouter();
  const mounted = useRef(false);

  const [openChip, setOpenChip] = useState<string | null>(null);
  const [goal, setGoal] = useState<Goal>("maintenance");

  const [unit, setUnit]         = useState<Unit>(initialUnit);
  const [sex, setSex]           = useState<Sex>(initialSex);
  const [age, setAge]           = useState(initialAge);
  const [weight, setWeight]     = useState(initialWeight);
  const [height, setHeight]     = useState(initialHeight);
  const [heightFt, setHeightFt] = useState(initialHeightFt);
  const [heightIn, setHeightIn] = useState(initialHeightIn);
  const [activity, setActivity] = useState<ActivityKey>(
    initialActivity in ACTIVITY ? (initialActivity as ActivityKey) : "sedentary"
  );

  // Derived
  const weightKg = unit === "imperial" ? weight * 0.453592 : weight;
  const heightCm = unit === "imperial" ? (heightFt * 12 + heightIn) * 2.54 : height;
  const bmr  = Math.round(calcBMR(weightKg, heightCm, age, sex));
  const tdee = Math.round(bmr * ACTIVITY[activity].value);
  const goalKcal = goal === "cut" ? tdee - 500 : goal === "bulk" ? tdee + 500 : tdee;

  // Sync URL after mount
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const p = new URLSearchParams({
      age: String(age), weight: String(weight),
      height: String(height), heightFt: String(heightFt), heightIn: String(heightIn),
      sex, activity, unit,
    });
    router.replace(`/results?${p}`, { scroll: false });
  }, [age, weight, height, heightFt, heightIn, sex, activity, unit]);

  return (
    <main className="min-h-dvh bg-background pb-20">
      <div className="max-w-[600px] mx-auto px-4 pt-6 space-y-4">

        {/* Chip row */}
        <div className="flex flex-wrap gap-2">

          {/* Unit — toggle on click */}
          <button
            onClick={() => setUnit(u => u === "metric" ? "imperial" : "metric")}
            className="inline-flex items-center h-8 px-3 rounded-[10px] border border-border bg-card text-sm font-medium tabular-nums text-foreground hover:bg-muted transition-colors"
          >
            {unit === "metric" ? "Metric" : "Imperial"}
          </button>

          {/* Sex — toggle on click */}
          <button
            onClick={() => setSex(s => s === "male" ? "female" : "male")}
            className="inline-flex items-center justify-center gap-1.5 h-8 w-24 rounded-[10px] border border-border bg-card text-sm font-medium tabular-nums text-foreground hover:bg-muted transition-colors"
          >
            {sex === "male" ? <Mars className="size-3.5" strokeWidth={2} /> : <Venus className="size-3.5" strokeWidth={2} />}
            {sex === "male" ? "Male" : "Female"}
          </button>

          {/* Age */}
          <Popover open={openChip === "age"} onOpenChange={o => setOpenChip(o ? "age" : null)}>
            <PopoverTrigger className="inline-flex items-center h-8 px-3 rounded-[10px] border border-border bg-card text-sm font-medium tabular-nums text-foreground hover:bg-muted transition-colors">
              {age} y/o
            </PopoverTrigger>
            <PopoverContent className="w-48 p-4">
              <StepperInput compact value={age} onChange={setAge} min={10} max={100} />
            </PopoverContent>
          </Popover>

          {/* Height */}
          <Popover open={openChip === "height"} onOpenChange={o => setOpenChip(o ? "height" : null)}>
            <PopoverTrigger className="inline-flex items-center h-8 px-3 rounded-[10px] border border-border bg-card text-sm font-medium tabular-nums text-foreground hover:bg-muted transition-colors">
              {unit === "metric" ? `${height} cm` : `${heightFt}'${heightIn}"`}
            </PopoverTrigger>
            <PopoverContent className="w-52 p-4">
              {unit === "metric" ? (
                <StepperInput compact value={height} onChange={setHeight} min={100} max={250} />
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="ml-1 text-xs text-muted-foreground">ft</Label>
                    <StepperInput compact value={heightFt} onChange={setHeightFt} min={3} max={8} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="ml-1 text-xs text-muted-foreground">in</Label>
                    <StepperInput compact value={heightIn} onChange={setHeightIn} min={0} max={11} />
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Weight */}
          <Popover open={openChip === "weight"} onOpenChange={o => setOpenChip(o ? "weight" : null)}>
            <PopoverTrigger className="inline-flex items-center h-8 px-3 rounded-[10px] border border-border bg-card text-sm font-medium tabular-nums text-foreground hover:bg-muted transition-colors">
              {weight.toFixed(1)} {unit === "metric" ? "kg" : "lbs"}
            </PopoverTrigger>
            <PopoverContent className="w-48 p-4">
              <StepperInput compact
                value={weight} onChange={setWeight}
                min={unit === "metric" ? 20 : 44}
                max={unit === "metric" ? 300 : 660}
                step={0.5} decimals={1}
              />
            </PopoverContent>
          </Popover>

          {/* Activity */}
          <Popover open={openChip === "activity"} onOpenChange={o => setOpenChip(o ? "activity" : null)}>
            <PopoverTrigger className="inline-flex items-center gap-1 h-8 px-3 rounded-[10px] border border-border bg-card text-sm font-medium tabular-nums text-foreground hover:bg-muted transition-colors">
              {ACTIVITY[activity].chip}
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className="w-80 p-1.5">
              {(Object.entries(ACTIVITY) as [ActivityKey, typeof ACTIVITY[ActivityKey]][]).map(([key, { name, detail }]) => (
                <button
                  key={key}
                  onClick={() => { setActivity(key); setOpenChip(null); }}
                  className={`w-full text-left px-3 py-2 rounded-[8px] text-sm transition-colors ${
                    key === activity ? "bg-muted font-medium text-foreground" : "text-foreground hover:bg-muted"
                  }`}
                >
                  {name} <span className="text-muted-foreground font-normal">({detail})</span>
                </button>
              ))}
            </PopoverContent>
          </Popover>

        </div>

        {/* Results card */}
        <Card className="ring-foreground/20 pb-0">
          <CardHeader className="px-6 pb-2">
            <CardTitle className="text-[19px] font-semibold">Your results</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-3">
            {[
              { label: "TDEE", sub: "Maintenance calories", value: tdee, highlight: true },
              { label: "BMR",  sub: "Base metabolic rate",  value: bmr,  highlight: false },
            ].map(({ label, sub, value, highlight }) => (
              <div key={label}
                className={`rounded-[8px] px-4 py-3.5 flex items-center justify-between ${highlight ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <div>
                  <p className={`text-base font-bold uppercase tracking-wide ${highlight ? "text-primary-foreground" : "text-foreground"}`}>{label}</p>
                  <p className={`text-sm font-medium ${highlight ? "text-primary-foreground" : "text-muted-foreground"}`}>{sub}</p>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-3xl font-bold font-mono tabular-nums ${highlight ? "text-primary-foreground" : "text-foreground"}`}>{value}</span>
                  <span className={`text-sm ${highlight ? "text-primary-foreground" : "text-muted-foreground"}`}>kcal</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Activity levels */}
        <Card className="ring-foreground/20 pb-0">
          <CardHeader className="px-6 pb-2">
            <CardTitle className="text-[19px] font-semibold">Activity levels</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-1">
              {(Object.entries(ACTIVITY) as [ActivityKey, typeof ACTIVITY[ActivityKey]][]).map(([key, { name, detail, value }]) => {
                const kcal = Math.round(bmr * value);
                const active = key === activity;
                return (
                  <div key={key}
                    className={`flex items-center justify-between rounded-[8px] px-3 py-2.5 ${active ? "bg-muted" : ""}`}>
                    <div>
                      <span className={`text-sm font-medium ${active ? "text-foreground" : "text-foreground"}`}>{name}</span>
                      <span className="text-sm ml-2 text-muted-foreground">({detail})</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-mono tabular-nums font-bold text-foreground">{kcal}</span>
                      <span className="text-sm text-muted-foreground">kcal</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Macros */}
        <Card className="ring-foreground/20 pb-0">
          <CardHeader className="px-6 pb-3">
            <CardTitle className="text-[19px] font-semibold">Macronutrients</CardTitle>
            {/* Goal tabs */}
            <div className="flex mt-2">
              {([
                { key: "maintenance", label: "Maintenance" },
                { key: "cut",         label: "Cut" },
                { key: "bulk",        label: "Bulk" },
              ] as const).map((g, i) => (
                <button key={g.key} onClick={() => setGoal(g.key)}
                  className={`flex-1 flex items-center justify-center border h-10 text-sm font-medium transition-[background-color,color,border-color] active:scale-[0.97] ${
                    i === 0 ? "rounded-l-[10px] rounded-r-none"
                    : i === 2 ? "rounded-r-[10px] rounded-l-none -ml-px"
                    : "rounded-none -ml-px"
                  } ${goal === g.key
                    ? "bg-foreground text-background border-foreground relative z-10 dark:bg-foreground/85 dark:border-foreground/85"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                  }`}>
                  {g.label}
                </button>
              ))}
            </div>
            <p className="text-base text-muted-foreground mt-4">
              {goal === "maintenance" && <>To maintain, eat <strong className="text-foreground">{goalKcal}</strong> kcal/day.</>}
              {goal === "cut" && <>To lose weight, eat <strong className="text-foreground">{goalKcal}</strong> kcal/day — 500 below maintenance.</>}
              {goal === "bulk" && <>To gain weight, eat <strong className="text-foreground">{goalKcal}</strong> kcal/day — 500 above maintenance.</>}
            </p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {/* Column headers */}
            <div className="grid grid-cols-4 bg-muted rounded-[8px] py-2.5 mb-1">
              <div />
              {MACRO_STRATEGIES.map((s) => (
                <div key={s.key} className="text-center px-1">
                  <p className="text-sm font-semibold text-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            {/* Rows */}
            {([
              { label: "Protein", key: "protein" as const },
              { label: "Fat",     key: "fat"     as const },
              { label: "Carbs",   key: "carbs"   as const },
            ]).map(({ label, key }, i) => {
              const vals = MACRO_STRATEGIES.map(s => macros(goalKcal, s)[key]);
              return (
                <div key={label} className="grid grid-cols-4 py-4">
                  <div className="flex items-center pl-2 text-sm font-medium text-muted-foreground">{label}</div>
                  {vals.map((g, j) => (
                    <div key={j} className="flex items-baseline justify-center gap-0.5">
                      <span className="text-[19px] font-bold font-mono tabular-nums text-foreground">{g}</span>
                      <span className="text-sm text-muted-foreground">g</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </CardContent>
        </Card>

      </div>
    </main>
  );
}
