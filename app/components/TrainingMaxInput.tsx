"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TrainingMaxInputProps {
  lift: string;
  oneRepMax: number;
  onOneRepMaxChange: (value: number) => void;
}

export function TrainingMaxInput({
  lift,
  oneRepMax,
  onOneRepMaxChange,
}: TrainingMaxInputProps) {
  const trainingMax = oneRepMax > 0 ? Math.round(oneRepMax * 0.9) : 0;
  const baseId = lift.replace(/\s+/g, "-").toLowerCase();

  const handle1RMChange = (value: number) => {
    onOneRepMaxChange(value);
  };

  const handleTMChange = (value: number) => {
    if (value <= 0) {
      onOneRepMaxChange(0);
      return;
    }
    const derived1RM = Math.round(value / 0.9);
    onOneRepMaxChange(derived1RM);
  };

  return (
    <div className="rounded-md border border-border bg-card/40 px-3 py-3">
      <Label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {lift}
      </Label>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${baseId}-1rm`} className="text-xs text-muted-foreground">
            1RM
          </Label>
          <Input
            id={`${baseId}-1rm`}
            type="number"
            min={0}
            placeholder="1RM"
            inputMode="numeric"
            value={oneRepMax || ""}
            onChange={(e) => handle1RMChange(Number(e.target.value) || 0)}
            className="min-h-11 touch-manipulation font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${baseId}-tm`} className="text-xs text-muted-foreground">
            TM (90%)
          </Label>
          <Input
            id={`${baseId}-tm`}
            type="number"
            min={0}
            placeholder="TM"
            inputMode="numeric"
            value={trainingMax || ""}
            onChange={(e) => handleTMChange(Number(e.target.value) || 0)}
            className="min-h-11 touch-manipulation font-mono"
          />
        </div>
      </div>
    </div>
  );
}
