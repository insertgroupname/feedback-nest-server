import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { appConfig } from './configs';
import { AppModule } from './app.module';

async function bootstrap() {
  const videoDir = 'upload/video';
  const audioDir = 'upload/audio';
  if (!fs.existsSync(videoDir) || !fs.existsSync(audioDir)) {
    fs.promises.mkdir(videoDir, { recursive: true });
    fs.promises.mkdir(audioDir, { recursive: true });
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Feedback API docs')
    .setDescription('Feedback for testing api docs')
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
