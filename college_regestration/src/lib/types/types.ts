import { Session } from "@supabase/supabase-js";
import { z } from "zod";

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

export type WeekDayTime = {
  Day: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  Time: Date;
};

export function getWeekDateTime(day: string, time: Date | string): WeekDayTime {
  if (typeof time == "string") {
    time = new Date(time);
  }
  let dayNum = 0;
  switch (day) {
    case "Monday":
      dayNum = 1;
      break;
    case "Tuesday":
      dayNum = 2;
      break;
    case "Wednsday":
      dayNum = 3;
      break;
    case "Thrusday":
      dayNum = 4;
      break;
    case "Friday":
      dayNum = 5;
      break;
    case "Saturday":
      dayNum = 6;
      break;
    case "Sunday":
      dayNum = 7;
      break;
    default:
      throw new Error("");
      break;
  }
  return { Day: dayNum as any, Time: time };
}
