import { z } from 'zod';

const MetaDataType = z.object({
  FirstName: z.string(),
  LastName: z.string(),
  MiddleName: z.string().optional(),
  Dob: z.string().datetime(),
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
