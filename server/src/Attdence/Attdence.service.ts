import { AppService } from 'src/app.service';
import { Injectable } from '@nestjs/common';
import { StudentAttCode, UUID } from 'src/User/User.Model';
import { UserService } from 'src/User/User.service';
import { GenerateOTP } from 'src/lib/otp';
import { TimeTableService } from 'src/TimeTable/TimeTable.service';

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
      const classTTId = await timeTableService.GetClassTimeTableId(teacherId);

      const AttdenceCode = (await supabase
        .from('AttdenceCode')
        .insert([
          {
            ClassTTId: classTTId,
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
              .eq('ClassTTId', classTTId);
          }, data.TTL);
        }

        return { Code: data.Code };
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
      const classTTId = await timeTableService.GetClassTimeTableId({
        Id: studentAttCode.Id,
      });

      const { data, error } = (await supabase
        .from('AttdenceCode')
        .select('*')
        .eq('ClassTTId', classTTId)
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
        return {
          Attdence: 'marked',
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
    TTId: UUID,
    appService: AppService,
    timeTableService: TimeTableService,
  ) {
    const supabase = appService.getSupabase();

    const classTTId = await timeTableService.GetClassTimeTableId(studentId);

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

    if (data.length > 0) {
      //
    }
  }
}
