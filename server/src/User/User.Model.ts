import { z } from 'zod';

export const MetaDataType = z.object({
  Name: z.object({
    FirstName: z.string(),
    LastName: z.string(),
    MiddleName: z.string().optional(),
  }),
  Dob: z.string().datetime(),
  Role: z.enum(['Teacher', 'Student', 'Staff']),
});

export const UserType = z.object({
  Id: z.string().uuid(),
  Email: z.string().email(),
  MetaData: MetaDataType,
});

export type User = z.infer<typeof UserType>;

export const RegesterUserType = z.object({
  Email: z.string().email(),
  Password: z.string(),
  MetaData: MetaDataType,
});

export type RegesterUser = z.infer<typeof RegesterUserType>;
