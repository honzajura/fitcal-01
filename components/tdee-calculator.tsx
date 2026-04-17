"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ACTIVITY_MULTIPLIERS = {
  sedentary: { label: "Sedentary (little/no exercise)", value: 1.2 },
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
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [activity, setActivity] = useState<ActivityKey>("moderate");
  const [result, setResult] = useState<{ bmr: number; tdee: number } | null>(null);

  function calculate() {
    const ageNum = parseFloat(age);
    let weightKg = parseFloat(weight);
    let heightCm: number;

    if (unit === "imperial") {
      weightKg = parseFloat(weight) * 0.453592;
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      heightCm = (ft * 12 + inches) * 2.54;
    } else {
      heightCm = parseFloat(height);
    }

    if (!ageNum || !weightKg || !heightCm) return;

    const bmr = calcBMR(weightKg, heightCm, ageNum, sex);
    const tdee = bmr * ACTIVITY_MULTIPLIERS[activity].value;
    setResult({ bmr: Math.round(bmr), tdee: Math.round(tdee) });
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">FitCal</h1>
        <p className="text-muted-foreground text-sm">
          Find your Total Daily Energy Expenditure
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">Your details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Unit toggle */}
          <div className="flex gap-2">
            <Button
              variant={unit === "metric" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setUnit("metric")}
            >
              Metric
            </Button>
            <Button
              variant={unit === "imperial" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setUnit("imperial")}
            >
              Imperial
            </Button>
          </div>

          {/* Sex */}
          <div className="flex gap-2">
            <Button
              variant={sex === "male" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setSex("male")}
            >
              Male
            </Button>
            <Button
              variant={sex === "female" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setSex("female")}
            >
              Female
            </Button>
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          {/* Weight */}
          <div className="space-y-1.5">
            <Label htmlFor="weight">
              Weight ({unit === "metric" ? "kg" : "lbs"})
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder={unit === "metric" ? "70" : "154"}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          {/* Height */}
          <div className="space-y-1.5">
            <Label>Height ({unit === "metric" ? "cm" : "ft / in"})</Label>
            {unit === "metric" ? (
              <Input
                type="number"
                placeholder="175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            ) : (
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="5 ft"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="10 in"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Activity */}
          <div className="space-y-1.5">
            <Label>Activity level</Label>
            <Select value={activity} onValueChange={(v) => setActivity(v as ActivityKey)}>
              <SelectTrigger className="w-full">
                <SelectValue />
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

          <Button className="w-full" onClick={calculate}>
            Calculate
          </Button>
        </CardContent>
      </Card>

      {result && (
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
              <ResultBox
                label="Cut"
                value={result.tdee - 500}
                sub="−500 kcal/day"
              />
              <ResultBox
                label="Bulk"
                value={result.tdee + 500}
                sub="+500 kcal/day"
              />
            </div>
          </CardContent>
        </Card>
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
      <p className={`text-2xl font-bold ${highlight ? "text-primary-foreground" : "text-foreground"}`}>
        {value.toLocaleString()}
      </p>
      <p className="text-xs">{sub}</p>
    </div>
  );
}
