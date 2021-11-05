import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';

import { AppModule } from './app.module';

import { appConfig } from './configs';

async function bootstrap() {
  const videoDir = 'upload/video';
  const audioDir = 'upload/audio';
  if (!fs.existsSync(videoDir) || !fs.existsSync(audioDir)) {
    fs.promises.mkdir(videoDir, { recursive: true });
    fs.promises.mkdir(audioDir, { recursive: true });
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('NestJS Realworld Example App')
    .setDescription('The Realworld API description')
    .setVersion('1.0')
    // .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);
  const appConfigExtract = appConfig();
  console.log(`server started on port ${appConfigExtract.port}`);
  await app.listen(appConfigExtract.port);
}
bootstrap();
