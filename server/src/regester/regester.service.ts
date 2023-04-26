import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { RegesterUser } from 'src/User/User.Model';
import { TeacherReg } from './Teacher.Model';

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
}
