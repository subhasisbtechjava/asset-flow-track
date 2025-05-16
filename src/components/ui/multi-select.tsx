"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
    label: string;
    value: unknown;
};

interface MultiSelectProps {
  options: Option[];
  value: unknown[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleValue = (v: string) => {
    if (value.includes(v)) {
      onChange(value.filter((item) => item !== v));
    } else {
      onChange([...value, v]);
    }
  };

  const getLabel = (val: string) => options.find((o) => o.value === val)?.label || val;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className={cn(
            "w-full flex items-center justify-between border border-input bg-background rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
            className
          )}
        >
          <span className="truncate text-left">
            {value.length > 0
              ? value.map(getLabel).join(", ")
              : placeholder}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 w-[var(--radix-popover-trigger-width)] max-h-64 overflow-y-auto rounded-md border bg-popover p-2 shadow-md focus:outline-none"
        >
          {options.map((option) => {
            const selected = value.includes(option.value);
            return (
              <div
                key={option.value}
                onClick={() => toggleValue(option.value)}
                className={cn(
                  "flex items-center px-2 py-1.5 rounded-md cursor-pointer text-sm",
                  selected
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                )}
              >
                <div className="mr-2 h-4 w-4 flex items-center justify-center border border-input rounded-sm bg-background">
                  {selected && <Check className="h-3 w-3 text-primary" />}
                </div>
                {option.label}
              </div>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
