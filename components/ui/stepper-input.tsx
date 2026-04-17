"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface StepperInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  decimals?: number;
}

export function StepperInput({ value, onChange, min, max, step = 1, suffix, decimals }: StepperInputProps) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState("");

  function decrement() {
    const next = parseFloat((value - step).toFixed(10));
    if (min !== undefined && next < min) return;
    onChange(next);
  }

  function increment() {
    const next = parseFloat((value + step).toFixed(10));
    if (max !== undefined && next > max) return;
    onChange(next);
  }

  function handleFocus() {
    setRaw(value.toString());
    setEditing(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRaw(e.target.value);
  }

  function handleBlur() {
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      let clamped = parsed;
      if (min !== undefined) clamped = Math.max(min, clamped);
      if (max !== undefined) clamped = Math.min(max, clamped);
      onChange(parseFloat(clamped.toFixed(10)));
    }
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") e.currentTarget.blur();
  }

  const display = decimals !== undefined ? value.toFixed(decimals) : Number.isInteger(value) ? value.toString() : value.toFixed(1);

  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-[12px] px-4 py-3 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground w-10 h-10"
        onClick={decrement}
        aria-label="Decrease"
      >
        <Minus className="!w-6 !h-6" strokeWidth={2} />
      </Button>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={editing ? raw : display}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-24 text-center text-3xl font-bold font-mono tabular-nums bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix && <span className="text-xl font-normal">{suffix}</span>}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground w-10 h-10"
        onClick={increment}
        aria-label="Increase"
      >
        <Plus className="!w-6 !h-6" strokeWidth={2} />
      </Button>
    </div>
  );
}
