import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

import { appConfig } from './configs';

async function bootstrap() {
  const appOption = { cors: true };
  const app = await NestFactory.create(AppModule, appOption);
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
