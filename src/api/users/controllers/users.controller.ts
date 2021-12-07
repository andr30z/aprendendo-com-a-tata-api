import {
  Body,
  Controller,
  Delete,
  Get,
  Param, Put,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { MongoSerializerInterceptor } from 'src/interceptors';
import { NotFoundInterceptor } from 'src/interceptors/not-found.interceptor';
import JwtAuthenticationGuard from '../../authentication/jwt-authentication.guard';
import { LoginCredentialsWithRequest } from '../../authentication/types';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@UseInterceptors(new NotFoundInterceptor('Registro não encontrado!'))
@UseInterceptors(MongoSerializerInterceptor(User))
@UseGuards(JwtAuthenticationGuard)
@ApiCookieAuth()
@ApiTags('User')
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  me(@Req() request: LoginCredentialsWithRequest) {
    return this.usersService.me(request);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}