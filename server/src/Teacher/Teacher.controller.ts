import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UUID } from 'src/User/User.Model';
import { AppService } from 'src/app.service';
import { TeacherService } from './Teacher.service';
import { UserService } from 'src/User/User.service';

@Controller('Teacher')
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly userService: UserService,
    private readonly appService: AppService,
  ) {}

  @Post('SubjectId')
  async GetTeachersByTeachingSubjectId(@Body('Id') SubjectId: string) {
    console.log({ SubjectId });
    return this.teacherService.GetTeacherBySubjectId(
      SubjectId,
      this.appService,
    );
  }
}
