// Day to main lift mapping
export const DAY_MAIN_LIFT: Record<number, string> = {
  1: "Squat",
  2: "Bench Press",
  3: "Deadlift",
  4: "Overhead Press",
};

// When less boring is true: main lift -> BBB lift (opposite pairing)
// Squat 531 -> Deadlift BBB, Bench 531 -> OHP BBB, Deadlift 531 -> Squat BBB, OHP 531 -> Bench BBB
export const BBB_LESS_BORING_MAP: Record<string, string> = {
  Squat: "Deadlift",
  "Bench Press": "Overhead Press",
  Deadlift: "Squat",
  "Overhead Press": "Bench Press",
};

// BBB percentage options: 30, 35, 40, ..., 80 (5% increments)
export const BBB_PERCENTAGE_OPTIONS = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80] as const;

export function getBBBLift(mainLift: string, lessBoring: boolean): string {
  return lessBoring ? BBB_LESS_BORING_MAP[mainLift] ?? mainLift : mainLift;
}

// Week percentages: [percent, reps] - "+" indicates AMRAP
export const WEEK_PERCENTAGES: Record<
  number,
  Array<{ percent: number; reps: number; amrap?: boolean }>
> = {
  1: [
    { percent: 65, reps: 5 },
    { percent: 75, reps: 5 },
    { percent: 85, reps: 5, amrap: true },
  ],
  2: [
    { percent: 70, reps: 3 },
    { percent: 80, reps: 3 },
    { percent: 90, reps: 3, amrap: true },
  ],
  3: [
    { percent: 75, reps: 5 },
    { percent: 85, reps: 3 },
    { percent: 95, reps: 1, amrap: true },
  ],
};

export function getTrainingMax(oneRepMax: number): number {
  return Math.round(oneRepMax * 0.9);
}

export function roundToNearest(value: number, increment = 5): number {
  return Math.ceil(value / increment) * increment;
}

export function calculateWeight(
  oneRepMax: number,
  percent: number
): number {
  const trainingMax = getTrainingMax(oneRepMax);
  return roundToNearest((trainingMax * percent) / 100);
}
