"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BBB_PERCENTAGE_OPTIONS } from "@/lib/531";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Program } from "./components/Program";
import { TrainingMaxInput } from "./components/TrainingMaxInput";

const LIFTS = ["Overhead Press", "Squat", "Bench Press", "Deadlift"] as const;

const LIFT_PARAM_KEYS: Record<(typeof LIFTS)[number], string> = {
  "Overhead Press": "ohp",
  Squat: "squat",
  "Bench Press": "bench",
  Deadlift: "dead",
};

function parseTrainingMaxes(searchParams: URLSearchParams) {
  const result: Record<string, number> = {};
  for (const lift of LIFTS) {
    const key = LIFT_PARAM_KEYS[lift];
    const value = searchParams.get(key);
    const num = value ? parseInt(value, 10) : 0;
    result[lift] = isNaN(num) ? 0 : Math.max(0, num);
  }
  return result;
}

function parseWeek(searchParams: URLSearchParams): number {
  const value = searchParams.get("week");
  const num = value ? parseInt(value, 10) : 1;
  return num >= 1 && num <= 4 ? num : 1;
}

function parseBBBPercentage(searchParams: URLSearchParams): number {
  const value = searchParams.get("bbb");
  const num = value ? parseInt(value, 10) : 50;
  return num >= 30 && num <= 80 && num % 5 === 0 ? num : 50;
}

function buildSearchParams(
  trainingMaxes: Record<string, number>,
  lessBoring: boolean,
  week: number,
  bbbPercentage: number
): URLSearchParams {
  const params = new URLSearchParams();
  for (const lift of LIFTS) {
    const value = trainingMaxes[lift] ?? 0;
    if (value > 0) {
      params.set(LIFT_PARAM_KEYS[lift], String(value));
    }
  }
  if (lessBoring) {
    params.set("less-boring", "1");
  }
  if (week > 1) {
    params.set("week", String(week));
  }
  if (bbbPercentage !== 50) {
    params.set("bbb", String(bbbPercentage));
  }
  return params;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialMaxes = useMemo(() => parseTrainingMaxes(searchParams), [searchParams]);
  const initialLessBoring = searchParams.get("less-boring") === "1";
  const initialWeek = useMemo(() => parseWeek(searchParams), [searchParams]);
  const initialBBB = useMemo(() => parseBBBPercentage(searchParams), [searchParams]);

  const [trainingMaxes, setTrainingMaxes] = useState<Record<string, number>>(initialMaxes);
  const [lessBoring, setLessBoring] = useState(initialLessBoring);
  const [week, setWeek] = useState(initialWeek);
  const [bbbPercentage, setBBBPercentage] = useState(initialBBB);

  useEffect(() => {
    setLessBoring(searchParams.get("less-boring") === "1");
  }, [searchParams]);

  const handleSubmit = () => {
    const params = buildSearchParams(trainingMaxes, lessBoring, week, bbbPercentage);
    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url, { scroll: false });
  };

  return (
    <div className="flex min-h-dvh w-full flex-col items-center bg-zinc-50 px-4 py-6 dark:bg-zinc-950 sm:px-6 sm:py-8">
      <Card className="w-full max-w-md flex-1 sm:flex-none">
        <CardHeader>
          <CardTitle className="text-2xl">5/3/1 BBB</CardTitle>
          <CardDescription>Enter 1RM or training max (90% of 1RM). Editing either updates the other; both are saved to the link.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {LIFTS.map((lift) => (
            <TrainingMaxInput key={lift} lift={lift} oneRepMax={trainingMaxes[lift] ?? 0} onOneRepMaxChange={(value) => setTrainingMaxes((prev) => ({ ...prev, [lift]: value }))} />
          ))}
          <div className="flex items-center justify-between gap-2 pt-2">
            <Label htmlFor="less-boring" className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Less boring
            </Label>
            <Switch
              id="less-boring"
              checked={lessBoring}
              onCheckedChange={(checked) => setLessBoring(checked === true)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="bbb" className="text-sm text-muted-foreground">
              BBB % (aim for 50% - 70%)
            </Label>
            <Select
              value={String(bbbPercentage)}
              onValueChange={(v) => setBBBPercentage(Number(v))}
            >
              <SelectTrigger id="bbb" className="w-full">
                <SelectValue placeholder="BBB %" />
              </SelectTrigger>
              <SelectContent>
                {BBB_PERCENTAGE_OPTIONS.map((p) => (
                  <SelectItem key={p} value={String(p)}>
                    {p}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Save to link
          </Button>
        </CardContent>
      </Card>

      <Program
        week={week}
        onWeekChange={setWeek}
        oneRepMaxes={trainingMaxes}
        lessBoring={lessBoring}
        bbbPercentage={bbbPercentage}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950" />}>
      <HomeContent />
    </Suspense>
  );
}
