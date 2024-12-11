import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { MulterModule } from '@nestjs/platform-express';

import { appStorage } from './utils/multer.config';
import { LoggerModule } from 'nestjs-pino';
import { LoggerMiddleware } from './middlwares/logger.middleware';
import { ShopModule } from './modules/shop/shop.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MulterModule.registerAsync({
      useFactory: () => ({
        // storage: appStorage,
        dest: './uploads',
      }),
    }),
    // LoggerModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_PASS,
      signOptions: {
        expiresIn: '1w',
      },
    }),
    AuthModule,
    ShopModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
