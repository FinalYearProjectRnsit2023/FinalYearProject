import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { RegesterUserType } from 'src/User/User.Model';
import { RegesterService } from './regester.service';

@Controller('Regester')
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
      console.error({ UserInfo });
      return { error: 'Invalid UserInfo', info: ex };
    }
    console.log({ UserInfo });
    const { data, error } = await this.regesterService.regesterUser(
      UserInfo,
      this.appService,
    );
    return { data, error };
  }
}
