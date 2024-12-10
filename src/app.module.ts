import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MongooseModule.forRoot(process.env.DB_URL),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_PASS,
      signOptions: {
        expiresIn: '1w',
      },
    }),
    AuthModule,
  ],
})
export class AppModule {}
