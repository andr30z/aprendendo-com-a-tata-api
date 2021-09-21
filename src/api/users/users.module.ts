import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './users.repository';
import { User, UserSchema } from './user.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
