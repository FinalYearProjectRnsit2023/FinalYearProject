import { Session } from "@supabase/supabase-js";
import { union, z } from "zod";

export type AppDataInterface = {
  auth?: Session;
  userMetaData?: UserMetadata;
  NavItems: NavItemsInterface;
};

export const NameType = z.object({
  FirstName: z.string(),
  LastName: z.string(),
  MiddleName: z.string().optional(),
});

export const RoleType = z.enum(["Teacher", "Student", "Staff"]);

export const MetaDataType = z.object({
  Name: NameType,
  Dob: z.string().datetime(),
  Role: RoleType,
});

export type UserMetadata = z.infer<typeof MetaDataType>;

export const defaultAppData: AppDataInterface = {
  NavItems: [],
};

export const defaultRegestrationType = "Student";

export const RegestrationType = z.object({
  MetaData: MetaDataType,
  Email: z.string().email(),
  Password: z.string(),
});

export type Regestration = z.infer<typeof RegestrationType>;

export type RegertrationError = {
  name: UserMetadata["Name"] | undefined;
  password: string | undefined;
  email: string | undefined;
};

export const defaultRegertrationError: RegertrationError = {
  name: undefined,
  password: undefined,
  email: undefined,
};

export type NavItem = {
  Url: string;
  Name: string;
  params?: string[];
  RolesPermited: UserMetadata["Role"][];
};

export type NavItemsInterface = NavItem[];

export const Days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type DaysType = typeof Days[number];

export function GetWeekDayNumber(Day: DaysType): number {
  return Days.indexOf(Day);
}

export const SelectedSubjectsType = z.object({
  SubjectId: z.string(),
  Name: z.string(),
  NumberOfClasses: z.number(),
});

export type SelectedSubjectsM = z.infer<typeof SelectedSubjectsType>;
