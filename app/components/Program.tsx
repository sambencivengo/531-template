"use client";

import {useState} from "react";
import {calculateWeight, DAY_MAIN_LIFT, getBBBLift, WEEK_PERCENTAGES} from "@/lib/531";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

interface ProgramProps {
  week: number;
  onWeekChange: (week: number) => void;
  oneRepMaxes: Record<string, number>;
  lessBoring: boolean;
  bbbPercentage: number;
}

function DayContent({day, week, oneRepMaxes, lessBoring, bbbPercentage}: {day: number; week: number; oneRepMaxes: Record<string, number>; lessBoring: boolean; bbbPercentage: number}) {
  const mainLift = DAY_MAIN_LIFT[day];
  const oneRepMax = oneRepMaxes[mainLift] ?? 0;
  const sets = WEEK_PERCENTAGES[week] ?? WEEK_PERCENTAGES[1];

  const bbbLift = getBBBLift(mainLift, lessBoring);
  const bbbOneRepMax = oneRepMaxes[bbbLift] ?? 0;
  const bbbWeight = bbbOneRepMax > 0 ? calculateWeight(bbbOneRepMax, bbbPercentage) : 0;

  const [bbbChecked, setBBBChecked] = useState<boolean[]>([false, false, false, false, false]);

  const toggleBBBCheck = (index: number) => {
    setBBBChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  if (oneRepMax <= 0) {
    return <p className="text-center text-sm text-muted-foreground">Enter your {mainLift} 1RM or Training Max above to see your main lift sets.</p>;
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h3 className="mb-4 text-center text-base font-semibold">{mainLift}</h3>
          <Table className="table-fixed text-center">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3 text-center">Weight</TableHead>
                <TableHead className="w-1/3 text-center">Reps</TableHead>
                <TableHead className="w-1/3 text-center">% of TM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sets.map((set, i) => {
                const weight = calculateWeight(oneRepMax, set.percent);
                return (
                  <TableRow key={i}>
                    <TableCell className="w-1/3 text-center font-mono">
                      <span className="inline-block min-w-[5ch] text-left">{weight} lbs</span>
                    </TableCell>
                    <TableCell className="w-1/3 text-center font-mono">
                      <span className="inline-block min-w-[3ch] text-left">
                        {set.reps}
                        {set.amrap && "+"}
                      </span>
                    </TableCell>
                    <TableCell className="w-1/3 text-center font-mono">
                      <span className="inline-block min-w-[4ch] text-left">{set.percent}%</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {bbbOneRepMax > 0 && (
          <div className="rounded-md border border-border bg-muted/30 px-4 py-3">
            <h4 className="mb-3 text-center text-sm font-medium">BBB: {bbbLift}</h4>
            <Table className="table-fixed text-center">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Weight</TableHead>
                  <TableHead className="text-center">Reps</TableHead>
                  <TableHead className="text-center">% of TM</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((setNum, i) => (
                  <TableRow key={setNum}>
                    <TableCell className="font-mono text-center">{bbbWeight} lbs</TableCell>
                    <TableCell className="font-mono text-center">10</TableCell>
                    <TableCell className="font-mono text-center">{bbbPercentage}%</TableCell>
                    <TableCell className="w-12">
                      <div className="flex justify-center">
                        <Checkbox checked={bbbChecked[i]} onCheckedChange={() => toggleBBBCheck(i)} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

export function Program({week, onWeekChange, oneRepMaxes, lessBoring, bbbPercentage}: ProgramProps) {
  return (
    <div className="mt-6 w-full max-w-lg flex-1 overflow-hidden rounded-lg border border-border bg-card shadow-sm sm:flex-none">
      <div className="flex justify-center gap-1 border-b border-border p-2">
        {[1, 2, 3].map((w) => (
          <Button key={w} variant="outline" size="sm" onClick={() => onWeekChange(w)} className={`min-w-18 ${week === w ? "border-black bg-black text-white hover:bg-black/90 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/90" : ""}`}>
            Week {w}
          </Button>
        ))}
      </div>
      <Tabs defaultValue="day-1" className="w-full gap-0">
        <TabsList className="grid w-full grid-cols-4 rounded-none p-0">
          <TabsTrigger value="day-1" className="rounded-b-none data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">
            Day 1
          </TabsTrigger>
          <TabsTrigger value="day-2" className="rounded-b-none data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">
            Day 2
          </TabsTrigger>
          <TabsTrigger value="day-3" className="rounded-b-none data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">
            Day 3
          </TabsTrigger>
          <TabsTrigger value="day-4" className="rounded-b-none data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">
            Day 4
          </TabsTrigger>
        </TabsList>
        <TabsContent value="day-1" className="min-h-[200px] px-6 py-6">
          <DayContent day={1} week={week} oneRepMaxes={oneRepMaxes} lessBoring={lessBoring} bbbPercentage={bbbPercentage} />
        </TabsContent>
        <TabsContent value="day-2" className="min-h-[200px] px-6 py-6">
          <DayContent day={2} week={week} oneRepMaxes={oneRepMaxes} lessBoring={lessBoring} bbbPercentage={bbbPercentage} />
        </TabsContent>
        <TabsContent value="day-3" className="min-h-[200px] px-6 py-6">
          <DayContent day={3} week={week} oneRepMaxes={oneRepMaxes} lessBoring={lessBoring} bbbPercentage={bbbPercentage} />
        </TabsContent>
        <TabsContent value="day-4" className="min-h-[200px] px-6 py-6">
          <DayContent day={4} week={week} oneRepMaxes={oneRepMaxes} lessBoring={lessBoring} bbbPercentage={bbbPercentage} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
