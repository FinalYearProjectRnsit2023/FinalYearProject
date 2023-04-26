import { AppService } from 'src/app.service';
import { Injectable } from '@nestjs/common';
import { UUID } from 'src/User/User.Model';
import { UserService } from 'src/User/User.service';

@Injectable()
export class TeacherService {
  async GetTeacherBySubjectId(SubjectId: string, appService: AppService) {
    const supabase = appService.getSupabase();

    const { data, error } = (await supabase
      .from('TeacherPreferedSubjects')
      .select('*')
      .eq('SubjectId', SubjectId)) as {
      data: {
        created_at: Date;
        TeacherId: UUID;
        SubjectId: string;
        isPrimary: boolean;
      }[];
      error: any;
    };

    return { data, error };
  }
}
