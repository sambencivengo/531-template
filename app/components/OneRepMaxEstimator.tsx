"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Epley formula: 1RM = weight × (1 + reps / 30)
function estimate1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps < 1) return 0;
  return Math.round(weight * (1 + reps / 30));
}

const LIFTS = ["Overhead Press", "Squat", "Bench Press", "Deadlift"] as const;

interface OneRepMaxEstimatorProps {
  onApplyToLift: (lift: string, oneRepMax: number) => void;
}

export function OneRepMaxEstimator({ onApplyToLift }: OneRepMaxEstimatorProps) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState<number | "">("");
  const [reps, setReps] = useState<number | "">("");
  const [selectedLift, setSelectedLift] = useState<string>("Squat");

  const w = typeof weight === "number" ? weight : 0;
  const r = typeof reps === "number" ? reps : 0;
  const estimated1RM = w > 0 && r >= 1 ? estimate1RM(w, r) : 0;

  const handleApply = () => {
    if (estimated1RM > 0) {
      onApplyToLift(selectedLift, estimated1RM);
    }
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-md border border-border bg-muted/30 px-3 py-3">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            {open ? (
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            )}
            <Label className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Estimate 1RM (Epley)
            </Label>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="mb-3 mt-3 text-xs text-muted-foreground">
            Enter a recent heavy set to estimate your 1RM: weight × (1 + reps ÷ 30)
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="est-weight" className="text-xs text-muted-foreground">
                Weight (lbs)
              </Label>
              <Input
                id="est-weight"
                type="number"
                min={1}
                placeholder="185"
                inputMode="numeric"
                value={weight === "" ? "" : weight}
                onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
                className="h-9 w-24 font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="est-reps" className="text-xs text-muted-foreground">
                Reps
              </Label>
              <Input
                id="est-reps"
                type="number"
                min={1}
                max={30}
                placeholder="5"
                inputMode="numeric"
                value={reps === "" ? "" : reps}
                onChange={(e) => setReps(e.target.value ? Number(e.target.value) : "")}
                className="h-9 w-16 font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Est. 1RM</span>
              <span className="flex h-9 items-center font-mono text-sm font-medium">
                {estimated1RM > 0 ? `${estimated1RM} lbs` : "—"}
              </span>
            </div>
            <div className="flex min-w-[140px] flex-1 flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Apply to</Label>
              <Select value={selectedLift} onValueChange={setSelectedLift}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIFTS.map((lift) => (
                    <SelectItem key={lift} value={lift}>
                      {lift}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleApply}
              disabled={estimated1RM <= 0}
              className="h-9"
            >
              Apply
            </Button>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
