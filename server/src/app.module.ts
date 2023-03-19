import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegesterModule } from './regester/regester.module';

@Module({
  imports: [RegesterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
