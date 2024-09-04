import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');

  const port = configService.get<number>('port');
  const env = configService.get<string>('nodeEnv');

  await app.listen(port);
  console.log(`Environment: ${env} -  App listens on port: ${port}`);
}
bootstrap();
