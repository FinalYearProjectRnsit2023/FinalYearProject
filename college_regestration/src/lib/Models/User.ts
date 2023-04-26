import { z } from "zod";
import supabase from "../supabase/dbApi";
import { MetaDataType } from "../types/types";

export const UserType = z.object({
  id: z.string().uuid(),
  metadata: MetaDataType,
  Email: z.string().email(),
});

export type UserM = z.infer<typeof UserType>;

export async function GetAllTeachers(): Promise<UserM[]> {
  var { data, error } = await supabase.from("Teachers").select("*");

  if (error) {
    console.error({ error });
    throw error;
  }

  console.log({ data });

  let ids = "(";

  const len = data?.length;
  for (let i = 0; i < (len as number | 0); i++) {
    ids += data?.at(i).id;

    if (i + 1 != len) {
      ids += ",";
    }
  }

  // data?.forEach((obj) => (ids += obj.id + ","));

  ids += ")";

  console.log({ ids });

  var { data, error } = await supabase
    .from("User")
    .select("*")
    .filter("id", "in", ids);

  // var { data, error } = await supabase
  //   .from("User")
  //   .select("*")
  //   .filter("id", "eq", "");

  if (error) {
    console.error({ error });
    throw error;
  }

  console.log({ data });

  return data as [];
}
