import { WeekDayTime } from "../lib/types/types";
import UUID from "../lib/types/uuid";

export interface ClassTT_SubjectTime {
  id: UUID;
  Day: WeekDayTime;
}

export interface ClassTT_Subject {
  id: UUID;
  TeacherId: UUID;
  SubjectId: string;
  ClassTiming: ClassTT_SubjectTime[];
}

export default class ClassTimeTableM {
  public TimeTableId: UUID;
  public Subjects: ClassTT_Subject[] | undefined;

  constructor(TTId: string) {
    this.TimeTableId = new UUID(TTId);
  }
}
