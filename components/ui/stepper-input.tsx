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
    <div className="flex h-[56px] items-center justify-between bg-card border border-border rounded-[12px] px-1.5">
      <Button
        variant="ghost"
        size="icon"
        className="group text-muted-foreground hover:text-foreground hover:bg-transparent dark:hover:bg-transparent w-9 h-9 shrink-0"
        onClick={decrement}
        aria-label="Decrease"
      >
        <Minus className="!w-5 !h-5 transition-transform [@media(hover:hover)]:group-hover:scale-110" strokeWidth={2} />
      </Button>
      <div className="flex min-w-0 flex-1 items-center justify-center gap-1">
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9.,]*"
          value={editing ? raw : display}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full min-w-0 text-center text-3xl font-bold font-mono tabular-nums bg-transparent border-none outline-none dark:text-foreground/85"
        />
        {suffix && <span className="text-lg font-normal shrink-0">{suffix}</span>}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="group text-muted-foreground hover:text-foreground hover:bg-transparent dark:hover:bg-transparent w-9 h-9 shrink-0"
        onClick={increment}
        aria-label="Increase"
      >
        <Plus className="!w-5 !h-5 transition-transform [@media(hover:hover)]:group-hover:scale-110" strokeWidth={2} />
      </Button>
    </div>
  );
}
