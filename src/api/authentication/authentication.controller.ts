import {
  Body,
  Controller,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { MongoSerializerInterceptor } from 'src/interceptors';
import { editFileName, imageFileFilter } from 'src/utils';
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
  constructor(private readonly authenticationService: AuthenticationService) { }
  // https://gabrieltanner.org/blog/nestjs-file-uploading-using-multer
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: editFileName,

      }),
      fileFilter: imageFileFilter,
    }))
  @Post('register')
  register(@Body() createAuthenticationDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    return this.authenticationService.register({ ...createAuthenticationDto, profilePhoto: file.filename });
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
