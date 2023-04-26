import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT);
  console.log(
    `⚡️[server]: Server is running at http://localhost:${process.env.PORT}`,
  );
}
bootstrap();
