import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { RegesterUser } from 'src/User/User.Model';

@Injectable()
export class RegesterService {
  async regesterUser(userInfo: RegesterUser, appService: AppService) {
    const adminAuthClient = appService.getSupabase().auth.admin;

    const { data, error } = await adminAuthClient.createUser({
      email: userInfo.Email,
      password: userInfo.Password,
      email_confirm: true,
      user_metadata: userInfo.MetaData,
    });

    return { data, error };
  }
}
