import { z } from "zod";
import supabase from "../supabase/dbApi";

export const SubjectType = z.object({
  id: z.string(),
  created_at: z.string().datetime().optional(),
  Name: z.string(),
  Credit: z.number(),
});

export type SubjectM = z.infer<typeof SubjectType>;

export async function GetAllSubjects(): Promise<SubjectM[]> {
  const { data, error } = await supabase.from("Subject").select("*");

  if (error) {
    console.error({ error });
    throw error;
  }
  return data;
}

export async function AddNewSubject(
  subject: SubjectM
): Promise<SubjectM | undefined> {
  try {
    const { data, error } = await supabase
      .from("Subject")
      .insert([subject])
      .select();
    if (data) {
      return { id: data[0].id, Name: data[0].Name, Credit: data[0].Credit };
    }
  } catch (error) {
    throw error;
  }
}
