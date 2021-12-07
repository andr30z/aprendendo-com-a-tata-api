import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from '../files/../files';
import { UsersController } from './controllers/users.controller';
import { UsersRepository, UserResponsibleRepository } from './repositories';
import { UsersService } from './services/users.service';
import {
  UserResponsible,
  User,
  UserSchema,
  UserResponsibleSchema,
} from './entities';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserResponsibleRepository],
  imports: [
    FilesModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserResponsible.name, schema: UserResponsibleSchema },
    ]),
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
