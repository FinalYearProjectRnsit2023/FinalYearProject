import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { RegesterUserType, UUID, UUIDType } from 'src/User/User.Model';
import { RegesterService } from './regester.service';
import { TeacherReg, TeacherRegType } from './Teacher.Model';

@Controller('Register')
export class RegesterController {
  constructor(
    private readonly regesterService: RegesterService,
    private readonly appService: AppService,
  ) {}

  @Post()
  async RegesterUser(@Body() UserInfo: any) {
    try {
      UserInfo = RegesterUserType.parse(UserInfo);
    } catch (ex) {
      console.log({ UserInfo });
      return { error: 'Invalid UserInfo', info: ex };
    }
    console.log({ UserInfo });
    const regesterReturn = await this.regesterService.regesterUser(
      UserInfo,
      this.appService,
    );
    return { regesterReturn };
  }

  @Post('Subject')
  async RegesterTeacherSubjects(@Body() teacherData: TeacherReg) {
    try {
      teacherData = TeacherRegType.parse(teacherData);
    } catch (error) {
      return { error };
    }
    return this.regesterService.registerTeacherSubjects(
      teacherData,
      this.appService,
    );
  }

  @Post('/fingerReg')
  async RegisterFingerprint(@Body() uid: UUID) {
    try {
      uid = UUIDType.parse(uid);
    } catch (error) {
      return { error };
    }

    return this.regesterService.registerFingerprint(uid, this.appService);
  }

  @Post('/fingerVerify')
  async VerifyFingerprint(@Body() uid: UUID) {
    try {
      uid = UUIDType.parse(uid);
    } catch (error) {
      return { error };
    }

    return this.regesterService.verifyFingerprint(uid, this.appService);
  }
}
