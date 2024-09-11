import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');

  const port = configService.get<number>('port');
  const env = configService.get<string>('nodeEnv');

  // initialize swagger
  // structure base document
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS App')
    .setDescription('Base setup for any NestJS app')
    .setVersion('1.0')
    .addTag('Basic NestJS app')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
      'access-token',
    )
    .build();
  // create document
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // setup document - provide path where SwaggerUI will be availabe,
  // (http:localhost:3000/api)
  // application instance and document object
  SwaggerModule.setup('api', app, document, {
    // expose swagger json document under: http://localhost:3000/swagger/json
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(port);
  console.log(`Environment: ${env} -  App listens on port: ${port}`);
}
bootstrap();
