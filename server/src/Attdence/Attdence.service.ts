import { AppService } from 'src/app.service';
import { Injectable } from '@nestjs/common';
import { StudentAttCode, UUID } from 'src/User/User.Model';
import { UserService } from 'src/User/User.service';
import { GenerateOTP } from 'src/lib/otp';
import { TimeTableService } from 'src/TimeTable/TimeTable.service';
import { ZodNumber } from 'zod';

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
          timeTableService,
          userService,
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
    timeTableService: TimeTableService,
    userService: UserService,
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

      const updatedValue = await supabase
        .from('Attdence')
        .update(updateTo)
        .eq('ClassTTId', classTTId)
        .eq('StudentId', studentId.Id)
        .select('*');

      return updatedValue;
    }
    return { error: 'Something went wrong' };
  }
}
