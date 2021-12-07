import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { ActivitiesModule } from './api/activities/activities.module';
import {
  AuthenticationController, AuthenticationService
} from './api/authentication';
import { LocalStrategy } from './api/authentication/authentication.strategy';
import { JwtRefreshTokenStrategy } from './api/authentication/jwt-refresh-token.strategy';
import { JwtStrategy } from './api/authentication/jwt.strategy';
import { ClassroomModule } from './api/classroom/classroom.module';
import { DeleteTmpFilesTask, FilesController, FilesService } from './api/files';
import { UsersModule } from './api/users/users.module';
import { NotificationsModule } from './api/notifications/notifications.module';
const DATABASE_CONNECTION = 'mongodb://localhost/aprendendo-com-a-tata';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
    }),
    PassportModule,
    MongooseModule.forRoot(DATABASE_CONNECTION),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        FILE_PATH_KEY: Joi.string().required(),
        FILE_PATH_HASH_ID: Joi.string().required()
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
    ClassroomModule,
    NotificationsModule,
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    FilesService,
    AuthenticationService,
    DeleteTmpFilesTask
    // {
    //   provide: APP_GUARD,
    //   useClass: UserTypeGuard,
    // },
  ],
  controllers: [FilesController, AuthenticationController],
})
export class AppModule { }
