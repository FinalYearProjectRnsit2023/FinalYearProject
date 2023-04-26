import { AppService } from 'src/app.service';
import { Injectable } from '@nestjs/common';
import { StudentAttCode, UUID } from 'src/User/User.Model';
import { UserService } from 'src/User/User.service';
import { GenerateOTP } from 'src/lib/otp';
import { TimeTableService } from 'src/TimeTable/TimeTable.service';
import { TypeOf, ZodNumber, object } from 'zod';

@Injectable()
export class AttdenceService {
  async CreateCode(
    teacherId: UUID,
    userService: UserService,
    appService: AppService,
    timeTableService: TimeTableService,
  ) {
    const supabase = appService.getSupabase();

    const isTeacher = await userService.IsTeacher(teacherId, appService);

    if (isTeacher.error) {
      return { error: isTeacher.error };
    }

    if (isTeacher.val) {
      const classTTId = await timeTableService.GetClassTimeTableId(
        teacherId,
        appService,
        userService,
      );

      if (classTTId.error) {
        return { error: classTTId.error };
      }

      console.log({ classTTId });

      const AttdenceCode = (await supabase
        .from('AttdenceCode')
        .insert([
          {
            ClassTTId: classTTId.id,
            Code: GenerateOTP(4),
            // TTL => Time To Live
            // 1_20_000 ms => 2 minutes
            // 0 => manual cleanup, for testing
            TTL: 0,
          },
        ])
        .select()) as {
        error: any;
        data: {
          ClassTTId: string;
          created_at: Date;
          Code: number;
          TTL: number;
        }[];
        count: any;
        status: number;
        statusText: string;
      };

      if (AttdenceCode.status == 201) {
        const data = AttdenceCode.data[0];
        if (data.TTL != 0) {
          setTimeout(async () => {
            await supabase
              .from('AttdenceCode')
              .delete()
              .eq('ClassTTId', classTTId.id);
          }, data.TTL);
        }

        return { Code: data.Code };
      } else {
        return { error: AttdenceCode.error };
      }
    } else {
      return {
        error: 'The request is not from teacher',
      };
    }
  }

  async VerifyCode(
    studentAttCode: StudentAttCode,
    userService: UserService,
    appService: AppService,
    timeTableService: TimeTableService,
  ) {
    const supabase = appService.getSupabase();

    const isStudent = await userService.IsStudent(
      { Id: studentAttCode.Id },
      appService,
    );

    if (isStudent.error) {
      return { error: isStudent.error };
    }

    if (isStudent.val) {
      const classTTId = await timeTableService.GetClassTimeTableId(
        {
          Id: studentAttCode.Id,
        },
        appService,
        userService,
      );

      if (classTTId.error) {
        return { error: classTTId.error };
      }

      const { data, error } = (await supabase
        .from('AttdenceCode')
        .select('*')
        .eq('ClassTTId', classTTId.id)
        .eq('Code', studentAttCode.Code)) as {
        data: {
          ClassTTId: string;
          created_at: Date;
          Code: number;
          TTL: number;
        }[];
        error: any;
      };

      if (error) {
        return { error };
      }

      if (data.length > 0) {
        const attdence = await this.MarkAttdence(
          { Id: studentAttCode.Id },
          data[0].ClassTTId,
          appService,
        );
        return {
          attdence,
        };
      } else {
        return {
          error: 'wrong OTP',
        };
      }
    } else {
      return { error: 'the user is not a student' };
    }
  }

  async MarkAttdence(
    studentId: UUID,
    classTTId: string,
    appService: AppService,
  ) {
    const supabase = appService.getSupabase();

    // const classTTId = await timeTableService.GetClassTimeTableId(
    //   studentId,
    //   appService,
    //   userService,
    // );

    const { data, error } = (await supabase
      .from('Attdence')
      .select('*')
      .eq('ClassTTId', classTTId)
      .eq('StudentId', studentId.Id)) as {
      data: {
        ClassTTId: string;
        StudentId: string;
        created_at: Date;
        m1: number;
        m2: number;
        m3: number;
        m4: number;
        m5: number;
      }[];
      error: any;
    };

    if (error) {
      return { error };
    }

    const ClassStudent = (await supabase
      .from('ClassStudent')
      .select('ClassId')
      .eq('StudentId', studentId.Id)) as {
      error: any;
      data: { ClassId: string }[];
    };

    if (ClassStudent.error) {
      return { error: ClassStudent.error };
    }

    const ClassData = (await supabase
      .from('Class')
      .select('StartMonth')
      .eq('id', ClassStudent.data[0].ClassId)) as {
      error: any;
      data: { StartMonth: number }[];
    };

    if (ClassData.error) {
      return { error: ClassData.error };
    }

    // return { ClassData };

    if (data.length > 0) {
      // return data[0];
      const now = new Date();
      const date = now.getDate();
      const month = now.getMonth() + 1;

      const StartMonth = ClassData.data[0].StartMonth;

      if (month - StartMonth > 5) {
        return {
          error: `The Class has been completed, StartMonth : ${ClassData.data[0].StartMonth}, current month : ${month}.`,
        };
      }

      const updateTo = {};

      switch (month - StartMonth + 1) {
        case 1:
          updateTo['m1'] = data[0].m1 | (1 << (date - 1));
          break;
        case 2:
          updateTo['m2'] = data[0].m2 | (1 << (date - 1));
          break;
        case 3:
          updateTo['m3'] = data[0].m3 | (1 << (date - 1));
          break;
        case 4:
          updateTo['m4'] = data[0].m4 | (1 << (date - 1));
          break;
        case 5:
          updateTo['m5'] = data[0].m5 | (1 << (date - 1));
          break;
        default:
          return { error: 'Sry The class is completed.' };
      }

      const updatedValue = (await supabase
        .from('Attdence')
        .update(updateTo)
        .eq('ClassTTId', classTTId)
        .eq('StudentId', studentId.Id)
        .select('m1, m2, m3, m4, m5')) as {
        error: any;
        data: { m1: number; m2: number; m3: number; m4: number; m5: number }[];
      };

      if (updatedValue.error) {
        return { error: updatedValue.error };
      }

      return true;

      // return updatedValue.data;
    }
    return { error: 'Something went wrong' };
  }

  async MarkAttdenceByUsn(
    Usn: string,
    timeTableService: TimeTableService,
    userService: UserService,
    appService: AppService,
  ) {
    const supabase = appService.getSupabase();

    const UserMaping = (await supabase
      .from('UsnMaping')
      .select('StudentId')
      .eq('Usn', Usn)) as { error: any; data: { StudentId: string }[] };

    if (UserMaping.error) {
      return { error: UserMaping.error };
    }

    // console.log(Usn);

    // return { Usn, UserMaping };

    const classTTId = await timeTableService.GetClassTimeTableId(
      {
        Id: UserMaping.data[0].StudentId,
      },
      appService,
      userService,
    );

    if (classTTId.error) {
      return { error: classTTId.error };
    }

    const mark = this.MarkAttdence(
      { Id: UserMaping.data[0].StudentId },
      classTTId.id,
      appService,
    );

    return mark;
  }

  async GetAttdence(
    userId: UUID,
    appService: AppService,
    userService: UserService,
  ) {
    const subabase = appService.getSupabase();

    const Name = await userService.GetUserName(userId, appService);

    if (Name.error) {
      return { error: Name.error };
    }

    const IsTeacher = await userService.IsTeacher(userId, appService);

    if (IsTeacher.error) {
      return { error: IsTeacher.error };
    }

    if (IsTeacher.val) {
      const Login = (await subabase
        .from('Login')
        .select('*')
        .eq('UserId', userId.Id)) as { error: any; data: any[] };

      if (Login.error) {
        return { error: Login.error };
      }

      return { name: Name.Name, count: Login.data.length };
    }

    const IsStudent = await userService.IsStudent(userId, appService);

    if (IsStudent.error) {
      return { error: IsStudent.error };
    }

    if (IsStudent.val) {
      const ClassStudent = (await subabase
        .from('ClassStudent')
        .select('ClassId')
        .eq('StudentId', userId.Id)) as {
        error: any;
        data: { ClassId: string }[];
      };

      if (ClassStudent.error) {
        return { error: ClassStudent.error };
      }

      const ClassData = (await subabase
        .from('Class')
        .select('TTId')
        .eq('id', ClassStudent.data[0].ClassId)) as {
        error: any;
        data: { TTId: string }[];
      };

      if (ClassData.error) {
        return { error: ClassData.error };
      }

      // return { data: ClassData.data };

      const ClassTT = (await subabase
        .from('ClassTT')
        .select('id, SubjectId')
        .eq('TTId', ClassData.data[0].TTId)) as {
        error: any;
        data: { id: string; SubjectId: string }[];
      };

      if (ClassTT.error) {
        return { error: ClassTT.error };
      }

      const Attdence = (await subabase
        .from('Attdence')
        .select('ClassTTId, m1, m2, m3, m4, m5')
        .in(
          'ClassTTId',
          ClassTT.data.map((classTT) => {
            return classTT.id;
          }),
        )
        .eq('StudentId', userId.Id)) as {
        error: any;
        data: {
          ClassTTId: string;
          m1: number;
          m2: number;
          m3: number;
          m4: number;
          m5: number;
        }[];
      };

      if (Attdence.error) {
        return { error: Attdence.error };
      }

      function GetAttdenceCount(ClassTTId: string): {
        subjectId: string;
        count: number;
      } {
        console.log({ ClassTTId, ClassTT: ClassTT.data });
        let subjectId = 'hgjhg';

        ClassTT.data.forEach((classtt) => {
          if (classtt.id == ClassTTId) {
            console.log({ classtt });
            subjectId = classtt.SubjectId;
          }
        });

        return { subjectId, count: 0 };
      }

      const attdence = Attdence.data.map((att) => {
        const attCount = GetAttdenceCount(att.ClassTTId);
        return attCount.subjectId + ': ' + attCount.count.toString();
      });

      return {
        name: Name.Name,
        attdence: attdence.join(', '),
      };

      // return { data: ClassTT.data };
    }

    return { error: 'Something went wrong' };
  }
}
