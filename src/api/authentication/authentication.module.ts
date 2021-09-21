import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersService, UsersRepository } from '../users';
import { LocalStrategy } from './authentication.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
  imports: [UsersService, UsersRepository],
})
export class AuthenticationModule {}
