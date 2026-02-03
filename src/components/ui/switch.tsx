"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SwitchOption<T> = { value: T; label: string };

type SwitchProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: [SwitchOption<T>, SwitchOption<T>];
  className?: string;
  "aria-label"?: string;
};

export function Switch<T extends string>({
  value,
  onChange,
  options,
  className,
  "aria-label": ariaLabel,
}: SwitchProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex rounded-full border border-border bg-muted/50 p-1",
        className
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            value === opt.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
