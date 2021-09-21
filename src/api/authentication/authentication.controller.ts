import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { MongoSerializerInterceptor } from 'src/interceptors';
import { CreateUserDto, User } from '../users';
import { AuthenticationService } from './authentication.service';
import { LocalAuthenticationGuard } from './local-authentication.guard';
import { LoginCredentialsWithRequest } from './types';
@ApiTags('Authentication')
@UseInterceptors(MongoSerializerInterceptor(User))
@Controller('v1/authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  register(@Body() createAuthenticationDto: CreateUserDto) {
    return this.authenticationService.register(createAuthenticationDto);
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(
    @Req() request: LoginCredentialsWithRequest,
    @Res() response: Response,
  ) {
    return this.authenticationService.login(request, response);
  }
}
