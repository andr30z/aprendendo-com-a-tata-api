import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from '../files/../files';
import { UsersController, UsersResponsibleController } from './controllers';
import { UsersRepository, UserResponsibleRepository } from './repositories';
import { UsersService, UserResponsibleService } from './services';
import {
  UserResponsible,
  User,
  UserSchema,
  UserResponsibleSchema,
} from './entities';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  controllers: [UsersController, UsersResponsibleController],
  providers: [
    UsersService,
    UsersRepository,
    UserResponsibleRepository,
    UserResponsibleService,
  ],
  imports: [
    FilesModule,
    NotificationsModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserResponsible.name, schema: UserResponsibleSchema },
    ]),
  ],
  exports: [
    UsersService,
    UsersRepository,
    UserResponsibleRepository,
    UserResponsibleService,
  ],
})
export class UsersModule {}
