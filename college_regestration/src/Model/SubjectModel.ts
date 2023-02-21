import supabase from "../lib/supabase/dbApi";

export default class SubjectM {
  public id: string;
  public name: string;
  public credit: number;

  constructor(id: string, name: string, credit: string) {
    this.id = id;
    this.name = name;
    this.credit = parseFloat(credit);
  }

  public static async getAllSubjects(): Promise<SubjectM[] | undefined> {
    const { data, error } = await supabase.from("Subject").select();
    console.log({ data, error });
    if (data) {
      return data.map(
        (subject) => new SubjectM(subject.id, subject.Name, subject.Credit)
      );
    }
    if (error) {
      throw error;
    }
  }
}
