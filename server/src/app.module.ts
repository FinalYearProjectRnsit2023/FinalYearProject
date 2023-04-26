import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttdenceModule } from './Attdence/Attdence.module';
import { RegesterModule } from './regester/regester.module';
import { TimeTableModule } from './TimeTable/TimeTable.module';
import { UserModule } from './User/User.module';
import { TeacherModule } from './Teacher/Teacher.module';

@Module({
  imports: [
    RegesterModule,
    UserModule,
    AttdenceModule,
    TimeTableModule,
    TeacherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
