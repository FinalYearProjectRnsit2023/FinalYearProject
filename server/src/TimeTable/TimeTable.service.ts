import { AppService } from 'src/app.service';
import { Injectable } from '@nestjs/common';
import { UUID } from 'src/User/User.Model';
import { TimeTable } from './TimeTable.Model';
import { UserService } from 'src/User/User.service';

@Injectable()
export class TimeTableService {
  async CreateTimeTable(TT: TimeTable, appService: AppService) {
    // create a new row in TimeTable Table => to get a new TTId
    // create a new class in Class Table => to get classId
    // create all the class (all the class subjects) in ClassTT => to get classTTId
    // asign a class (class subject) to a time period in ClassTime Table using ClassPeriod

    // console.log(TT.SubjectTeacher);

    const supabase = appService.getSupabase();

    const timeTable = (await supabase
      .from('TimeTable')
      .insert([{}])
      .select()) as {
      error: any;
      data: {
        id: string;
        created_at: Date;
      }[];
    };

    const Class = (await supabase
      .from('Class')
      .insert([
        {
          ClassTeacher: TT.Class.ClassTeacher,
          TTId: timeTable.data[0].id,
          Sem: TT.Class.Class,
          Sec: TT.Class.Section,
          Year: TT.Class.Year,
          StartMonth: TT.Class.StartMonth,
        },
      ])
      .select()) as {
      error: any;
      data: {
        id: string;
        created_at: Date;
        ClassTeacher: string;
        TTId: string;
        Sem: number;
        Sec: string;
        Year: number;
        StartMonth: number;
      }[];
    };

    const SubjectTeachers = Object.entries(TT.SubjectTeacher);

    const ClassTTs = (await supabase
      .from('ClassTT')
      .insert([
        ...SubjectTeachers.map((data) => {
          return {
            TTId: timeTable.data[0].id,
            TeacherId: data[1],
            SubjectId: data[0],
          };
        }),
      ])
      .select()) as {
      error: any;
      data: {
        id: string;
        created_at: Date;
        TTId: string;
        TeacherId: string;
        SubjectId: string;
      }[];
    };

    const ClassPeriods = (await supabase.from('ClassPeriods').select('*')) as {
      error: any;
      data: {
        id: number;
        Day: string;
        StartTime: string;
        EndTime: string;
      }[];
    };

    const ClassTiming = [] as { ClassTTId: string; ClassPeriod: number }[];

    // populates the ClassTiming array with proper data by parsing ClassTT, TT.Time
    for (let i = 0; i < SubjectTeachers.length; i++) {
      const [SubjectId, TeacherId] = SubjectTeachers[i] as [string, string];

      let ClassTTId = '';
      ClassTTs.data.forEach((ClassTT) => {
        if (ClassTT.SubjectId == SubjectId && ClassTT.TeacherId == TeacherId) {
          // console.log([SubjectId, TeacherId], ClassTT);
          ClassTTId = ClassTT.id;
        }
      });

      TT.Days.forEach((Day) => {
        Day.Time.forEach((Time) => {
          if (Time.SubjectId == SubjectId) {
            ClassPeriods.data.forEach((ClassPer) => {
              // console.log({
              //   Time: Time.Time.split('-')[0].trim() + ':00',
              //   ClassPer: ClassPer.StartTime.trimStart,
              // });
              if (
                ClassPer.StartTime == Time.Time.split('-')[0].trim() + ':00' &&
                ClassPer.Day == Day.Day
              ) {
                ClassTiming.push({ ClassTTId, ClassPeriod: ClassPer.id });

                console.log({ ClassTTId, ClassPeriod: ClassPer.id });
              }
            });
          }
        });
      });
    }

    const ClassTime = (await supabase
      .from('ClassTime')
      .insert([...ClassTiming])
      .select()) as {
      error: any;
      data: {
        id: string;
        created_at: Date;
        ClassTTId: string;
        ClassPeriod: number;
      }[];
    };

    return {
      timeTable: timeTable.data[0],
      Class: Class.data[0],
      ClassTTs: ClassTTs.data,
      ClassPeriods: ClassPeriods.data,
      ClassTime: ClassTime.data,
      error: {
        timeTable: timeTable.error,
        Class: Class.error,
        ClassTTs: ClassTTs.error,
        error: ClassPeriods.error,
        ClassTime: ClassTime.error,
      },
    };

    // const now = new Date();
    // const nowDateTime = now.toISOString();
    // const nowDate = nowDateTime.split('T')[0];
    // const hms = ClassPeriods.data[0].StartTime;
    // const target = new Date(nowDate + 'T' + hms);
    // console.log({ target, now });

    return {
      ClassPeriods: {
        data: ClassPeriods.data,
        error: ClassPeriods.error,
      },
    };
  }

  async GetClassTimeTableId(
    userId: UUID,
    appService: AppService,
    userService: UserService,
  ) {
    console.log(userId);

    const supabase = appService.getSupabase();

    const weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ] as const;

    // const now = new Date();
    // const Day = weekday[now.getDay()];
    // const Time = now.toLocaleTimeString('it-IT');

    const Day = weekday[1];
    const Time = '09:00:00';

    const ClassPeriod = (await supabase
      .from('ClassPeriods')
      .select('id')
      .eq('Day', Day)
      .lte('StartTime', Time)
      .gte('EndTime', Time)) as { error: any; data: { id: number }[] };

    if (ClassPeriod.error) {
      return { error: ClassPeriod.error };
    }

    const isTeacher = await userService.IsTeacher(userId, appService);

    if (isTeacher.error) {
      return { error: isTeacher.error };
    }

    if (isTeacher.val) {
      const ClassTT = (await supabase
        .from('ClassTT')
        .select('*')
        .eq('TeacherId', userId.Id)) as {
        error: any;
        data: {
          id: string;
          created_at: Date;
          TTId: string;
          TeacherId: string;
          SubjectId: string;
        }[];
      };

      if (ClassTT.error) {
        return { error: ClassTT.error };
      }

      const ClassTime = (await supabase
        .from('ClassTime')
        .select('ClassTTId')
        .eq('ClassPeriod', ClassPeriod.data[0].id)
        .in(
          'ClassTTId',
          ClassTT.data.map((classtt) => {
            return classtt.id;
          }),
        )) as {
        error: any;
        data: { ClassTTId: string }[];
      };

      if (ClassTime.error) {
        return {
          error: ClassTime.error,
        };
      }

      return { id: ClassTime.data[0].ClassTTId };
    }

    const isStudent = await userService.IsStudent(userId, appService);

    if (isStudent.error) {
      return { error: isStudent.error };
    }

    if (isStudent.val) {
      const ClassStudent = (await supabase
        .from('ClassStudent')
        .select('ClassId')
        .eq('StudentId', userId.Id)) as {
        error: any;
        data: { ClassId: string }[];
      };

      if (ClassStudent.error) {
        return { error: ClassStudent.error };
      }

      const ClassData = (await supabase
        .from('Class')
        .select('TTId')
        .eq('id', ClassStudent.data[0].ClassId)) as {
        error: any;
        data: { TTId: string }[];
      };

      if (ClassData.error) {
        return { error: ClassData.error };
      }

      const ClassTT = (await supabase
        .from('ClassTT')
        .select('id')
        .eq('TTId', ClassData.data[0].TTId)) as {
        error: any;
        data: { id: string }[];
      };

      if (ClassTT.error) {
        return { error: ClassTT.error };
      }

      const ClassTime = (await supabase
        .from('ClassTime')
        .select('ClassTTId')
        .eq('ClassPeriod', ClassPeriod.data[0].id)
        .in(
          'ClassTTId',
          ClassTT.data.map((classtt) => {
            return classtt.id;
          }),
        )) as {
        error: any;
        data: { ClassTTId: string }[];
      };

      if (ClassTime.error) {
        return {
          error: ClassTime.error,
        };
      }

      return { id: ClassTime.data[0].ClassTTId };
    }

    return { error: 'Something went wrong' };
  }

  async GetClassTime(
    Day: string,
    StartTime: string,
    EndTime: string,
    appService: AppService,
  ) {
    const subabase = appService.getSupabase();

    const { data, error } = await subabase
      .from('ClassPeriods')
      .select('*')
      .eq('Day', Day)
      .gte('StartTime', StartTime)
      .lte('EndTime', EndTime);

    return { data, error };
  }
}
