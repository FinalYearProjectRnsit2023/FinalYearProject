import { Dispatch, SetStateAction } from "react";
import { AppDataInterface } from "../../lib/types/types";

export type AppDataContext = [
  AppDataInterface,
  Dispatch<SetStateAction<AppDataInterface>>
];
