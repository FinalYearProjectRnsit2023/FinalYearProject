import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { UserController } from './User.controller';
import { UserService } from './User.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AppService],
})
export class UserModule {}
