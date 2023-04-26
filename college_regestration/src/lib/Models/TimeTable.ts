import { z } from "zod";
import { Days, DaysType, GetWeekDayNumber } from "../types/types";
import { useMemo, useRef } from "react";

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
          Class: z.string(),
        })
      ),
    })
  ),
});

export type Phase2M = z.infer<typeof Phase2Type>;

type Period = {
  Time: string;
  Class: string;
};

export const PeriodTimes = [
  { Time: "08:40 - 09:40", Class: "Class1" },
  { Time: "09:40 - 10:40", Class: "Class2" },
  { Time: "10:40 - 11:00", Class: "Breakfast" },
  { Time: "11:00 - 12:00", Class: "Class3" },
  { Time: "12:00 - 13:00", Class: "Class4" },
  { Time: "13:00 - 13:40", Class: "Lunch" },
  { Time: "13:40 - 14:40", Class: "Class5" },
  { Time: "14:40 - 15:40", Class: "Class6" },
  { Time: "15:40 - 16:40", Class: "Class7" },
] as const;

export const Phase1Default: Phase1M = {
  Class: 0,
  Section: "",
  Year: 0,
  StartMonth: 0,
  ClassTeacher: "",
};

export const Phase2Default = {
  Days: Days.map((day) => ({
    Day: day,
    Time: PeriodTimes.map((PeriodTime) => ({
      id: day + "-" + PeriodTime.Class,
      // ref: useMemo(() => {
      //   return useRef<HTMLSelectElement>(null);
      // }, []),
      SubjectId: "",
      Time: PeriodTime.Time,
      Class: PeriodTime.Class,
    })),
  })),
};

export type Phase2DefaultT = typeof Phase2Default;

export const DefTimeTable = {
  Class: {
    Class: 0,
    Section: "",
    Year: 0,
    StartMonth: 0,
    ClassTeacher: "",
  },
  Days: Days.map((day) => ({
    Day: day,
    Time: PeriodTimes.map((period) => ({
      Time: period.Time,
      Class: period.Class,
      SubjectId: "",
    })),
  })),
  SubjectCount: {} as { [key: string]: number | undefined },
  SubjectTeacher: {} as { [key: string]: string },
};

export type TimeTableT = typeof DefTimeTable;

export function GetDayId(day: DaysType) {
  return GetWeekDayNumber(day);
}

export type PeriodTimesType = (typeof PeriodTimes)[number];

export function GetPeriodInd(Class: PeriodTimesType["Class"]) {
  for (let i = 0; i < PeriodTimes.length; i++) {
    if (PeriodTimes[i].Class == Class) {
      return i;
    }
  }
  return -1;
}
