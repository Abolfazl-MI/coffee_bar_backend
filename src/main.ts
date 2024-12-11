import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1',
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log('running application ');
    console.log(`http://localhost:${process.env.PORT ?? 3000}/`);
  });
}

bootstrap();
