import { NestFactory } from '@nestjs/core';
import { dump } from 'js-yaml';
import { writeFile } from 'fs-extra';
import { join } from 'path';
import { Request } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { mkdirSync } from 'fs';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use;
  // TODO: prodモードだとswaggerを出力しないように
  createSwaggerDocument(app);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    credentials: false,
    origin: ['http://localhost:3000'],
  });
  app.use(cookieParser());
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
      value: (req: Request) => {
        return req.header('csrf-token');
      },
    }),
  );

  await app.listen(process.env.PORT);
}

async function createSwaggerDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('nest-sample')
    .setDescription('nest-sampleApi')
    .setVersion('1.0')
    .addTag('nest')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const yamlDocument = dump(document, {
    skipInvalid: true,
    noRefs: true,
  });

  const dirPath = join('.dev', 'api');
  const yamlPath = join(dirPath, 'openapi.yml');
  mkdirSync(dirPath, { recursive: true });
  writeFile(yamlPath, yamlDocument);

  SwaggerModule.setup('swagger', app, document);
}

bootstrap();
