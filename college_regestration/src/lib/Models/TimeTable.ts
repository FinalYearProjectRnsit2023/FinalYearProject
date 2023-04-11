import { z } from "zod";
import { Days } from "../types/types";

export const Phase1Type = z.object({
  Class: z.number(),
  Section: z.string(),
  Year: z.number(),
  StartMonth: z.number(),
  ClassTeacher: z.string().uuid(),
});

export type Phase1M = z.infer<typeof Phase1Type>;

export const Phase2Type = z.object({
  Days: z.array(
    z.object({
      Day: z.string(),
      Time: z.array(
        z.object({
          SubjectId: z.string(),
          Time: z.string(),
        })
      ),
    })
  ),
});

export type Phase2M = z.infer<typeof Phase2Type>;

export const Periods = [
  "Class 1",
  "Class 2",
  "Breakfast",
  "Class 3",
  "Class 4",
  "Lunch",
  "Class 5",
  "Class 6",
  "Class 7",
] as const;

export const Phase1Default: Phase1M = {
  Class: 0,
  Section: "",
  Year: 0,
  StartMonth: 0,
  ClassTeacher: "",
};

export const Phase2Default: Phase2M = {
  Days: Days.map((day) => ({
    Day: day,
    Time: Periods.map((period) => ({
      SubjectId: "",
      Time: period,
    })),
  })),
};
