import { Module } from '@nestjs/common';
import { TeacherController } from './Teacher.controller';
import { AppService } from 'src/app.service';
import { TeacherService } from './Teacher.service';
import { UserService } from 'src/User/User.service';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService, UserService, AppService],
})
export class TeacherModule {}
