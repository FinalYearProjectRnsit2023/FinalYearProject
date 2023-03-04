import { Session } from "@supabase/supabase-js";

export type AppDataInterface = {
  auth?: Session;
  userMetaData?: UserMetadata;
  NavItems: NavItemsInterface;
};

export type UserMetadata = {
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string | Date;
};

export const defaultAppData: AppDataInterface = {
  NavItems: [],
};

export type RegestrationType = "Student" | "Teacher";

export const defaultRegestrationType: RegestrationType = "Student";

export type RegertrationError = {
  name:
    | {
        firstName: string | undefined;
        middleName: string | undefined;
        lastName: string | undefined;
      }
    | undefined;
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
  init?: Function;
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
