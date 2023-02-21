import supabase from "../lib/supabase/dbApi";

export default class SubjectM {
  public id: string;
  public name: string;
  public credit: number;

  constructor(id?: string, name?: string, credit?: string);
  constructor(id: string, name: string, credit: string) {
    this.id = id ?? "";
    this.name = name ?? "";
    this.credit = parseFloat(credit) ?? 0;
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

  public static async addNewSubject(
    id: string,
    Name: string,
    Credit: number
  ): Promise<SubjectM | undefined> {
    try {
      const { data, error } = await supabase
        .from("Subject")
        .insert({
          id,
          Name,
          Credit,
        })
        .select();
      if (data) {
        return new SubjectM(data[0].id, data[0].Name, data[0].Credit);
      }
    } catch (error) {
      throw error;
    }
  }
}
