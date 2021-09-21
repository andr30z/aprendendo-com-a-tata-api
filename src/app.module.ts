import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import {
  AuthenticationController,
  AuthenticationService,
} from './api/authentication';
import { LocalStrategy } from './api/authentication/authentication.strategy';
import { JwtStrategy } from './api/authentication/jwt.strategy';
import { UsersModule } from './api/users/users.module';
const DATABASE_CONNECTION = 'mongodb://localhost/aprendendo-com-a-tata';

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE_CONNECTION),
    PassportModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}`,
        },
      }),
    }),
    UsersModule,
  ],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
  controllers: [AuthenticationController],
})
export class AppModule {}
