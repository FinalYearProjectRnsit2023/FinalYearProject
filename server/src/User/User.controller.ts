import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { UUID, UUIDType } from './User.Model';
import { UserService } from './User.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly appService: AppService,
  ) {}

  @Get('register')
  async IsRegistered(@Body() registerRequest: UUID) {
    try {
      registerRequest = UUIDType.parse(registerRequest);
    } catch (ex) {
      console.error({ ex });
      console.log({ registerRequest });
      return { error: 'Invalid RegisterRequest', info: ex };
    }
    console.log({ registerRequest });

    return this.userService.CheckUserRegister(registerRequest, this.appService);
  }

  @Get()
  async GetUser(@Body() userId: UUID) {
    return this.userService.GetUserName(userId, this.appService);
  }
}
