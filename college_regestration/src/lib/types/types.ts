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
};

export type NavItemsInterface = NavItem[];
