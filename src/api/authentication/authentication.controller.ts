import {
  Body,
  Controller,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { MongoSerializerInterceptor } from 'src/interceptors';
import { CreateUserDto, User } from '../users';
import { AuthenticationService } from './authentication.service';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import JwtRefreshGuard from './jwt-refresh.guard';
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
  @ApiBody({
    schema: {
      example: {
        email: 'email',
        password: 'password',
      },
    },
  })
  @Post('login')
  logIn(
    @Req() request: LoginCredentialsWithRequest,
    @Res() response: Response,
  ) {
    return this.authenticationService.login(request, response);
  }

  @ApiResponse({
    schema: {
      example: {
        email: 'email',
        password: 'password',
      },
    },
  })
  @UseGuards(JwtRefreshGuard)
  @Put('refresh')
  refreshToken(
    @Req() request: LoginCredentialsWithRequest,
    @Res() response: Response,
  ) {
    return this.authenticationService.refresh(request, response);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  logOut(
    @Req() request: LoginCredentialsWithRequest,
    @Res() response: Response,
  ) {
    return this.authenticationService.logout(request, response);
  }
}
