import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { RegesterUser, UUID } from 'src/User/User.Model';
import { TeacherReg } from './Teacher.Model';
import axios from 'axios';

@Injectable()
export class RegesterService {
  async regesterUser(userInfo: RegesterUser, appService: AppService) {
    const supabase = await appService.getSupabase();
    const adminAuthClient = supabase.auth.admin;

    const { data, error } = await adminAuthClient.createUser({
      email: userInfo.Email,
      password: userInfo.Password,
      email_confirm: true,
      user_metadata: userInfo.MetaData,
    });

    const NewUser = await supabase.from('User').insert([
      {
        id: data.user.id,
        Email: data.user.email,
        metadata: data.user.user_metadata,
      },
    ]);

    if (error) {
      return { error };
    }

    let userData = {};

    if (userInfo.MetaData.Role === 'Student') {
      userData = await supabase.from('Students').insert([
        {
          id: data.user.id,
        },
      ]);
    }

    if (userInfo.MetaData.Role === 'Teacher') {
      userData = await supabase.from('Teachers').insert([
        {
          id: data.user.id,
        },
      ]);
    }

    if (userInfo.MetaData.Role === 'Staff') {
      userData = await supabase.from('Staffs').insert([
        {
          id: data.user.id,
        },
      ]);
    }

    return { data, NewUser, userData };
  }

  async registerTeacherSubjects(
    teacherData: TeacherReg,
    appService: AppService,
  ) {
    const supabase = appService.getSupabase();

    const { data, error } = await supabase
      .from('TeacherPreferedSubjects')
      .insert([
        {
          TeacherId: teacherData.TeacherId,
          SubjectId: teacherData.primary,
          isPrimary: true,
        },
        {
          TeacherId: teacherData.TeacherId,
          SubjectId: teacherData.optinal,
          isPrimary: false,
        },
      ]);

    if (error) {
      return { error };
    }

    return { data };
  }

  async registerFingerprint(userId: UUID, appService: AppService) {
    const supabase = appService.getSupabase();

    const fps = await axios({
      url: `http://127.0.0.1:8000/read?uid=${userId.Id}`,
      method: 'GET',
      headers: {
        // 'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    console.log(fps.data);
    const fingerTemplate = fps.data as number[];

    const { data, error } = (await supabase
      .from('UserFingerPrint')
      .insert([{ userId: userId.Id, template: fingerTemplate }])
      .select('*')) as {
      error: any;
      data: { userId: string; template: any }[];
    };

    if (error) {
      return { error };
    }

    return { data };
  }

  async verifyFingerprint(userId: UUID, appService: AppService) {
    console.log('verifyFingerprint');
    const supabase = appService.getSupabase();

    const fp = (await supabase
      .from('UserFingerPrint')
      .select('*')
      .eq('userId', userId.Id)) as {
      error: any;
      data: {
        userId: string;
        template: number[];
      }[];
    };

    // return fp.data;

    if (fp.error) {
      return { error: fp.data };
    }

    const template = fp.data[0].template;

    const url = `http://127.0.0.1:8000/verify?template=[${template}]`;

    const fps = await axios({
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    return fps.data;
  }
}
