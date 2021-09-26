import * as Joi from '@hapi/joi';
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import {
  AuthenticationController,
  AuthenticationService,
} from './api/authentication';
import { LocalStrategy } from './api/authentication/authentication.strategy';
import { JwtRefreshTokenStrategy } from './api/authentication/jwt-refresh-token.strategy';
import { JwtStrategy } from './api/authentication/jwt.strategy';
import { UsersModule } from './api/users/users.module';
import { ActivitiesModule } from './api/activities/activities.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
const DATABASE_CONNECTION = 'mongodb://localhost/aprendendo-com-a-tata';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forRoot(DATABASE_CONNECTION),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`,
        },
      }),
    }),
    UsersModule,
    ActivitiesModule,
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthenticationController],
})
export class AppModule {}
