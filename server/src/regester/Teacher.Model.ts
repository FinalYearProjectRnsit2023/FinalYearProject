import { z } from 'zod';

export const TeacherRegType = z.object({
  TeacherId: z.string().uuid(),
  primary: z.string(),
  optinal: z.string(),
});

export type TeacherReg = z.infer<typeof TeacherRegType>;
