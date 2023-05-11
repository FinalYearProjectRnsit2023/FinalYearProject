// export const DefTimeTable = {
//   Class: {
//     Class: 0,
//     Section: "",
//     Year: 0,
//     StartMonth: 0,
//     ClassTeacher: "",
//   },
//   Days: Days.map((day) => ({
//     Day: day,
//     Time: PeriodTimes.map((period) => ({
//       Time: period.Time,
//       Class: period.Class,
//       SubjectId: "",
//     })),
//   })),
//   SubjectCount: {} as { [key: string]: number | undefined },
//   SubjectTeacher: {} as { [key: string]: string },
// };

import { z } from 'zod';

export const TimeTableT = z.object({
  Class: z.object({
    Class: z.number(),
    Section: z.string(),
    Year: z.number(),
    StartMonth: z.number(),
    ClassTeacher: z.string().uuid(),
  }),
  Days: z.array(
    z.object({
      Day: z.string(),
      Time: z.array(
        z.object({
          Time: z.string(),
          Class: z.string(),
          SubjectId: z.string(),
        }),
      ),
    }),
  ),
  SubjectCount: z.any(),
  SubjectTeacher: z.any(),
});

export type TimeTable = z.infer<typeof TimeTableT>;
