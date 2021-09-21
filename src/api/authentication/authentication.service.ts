import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NextFunction, Response } from 'express';
import { CreateUserDto, UsersRepository, UsersService } from '../users';
import { LoginCredentialsWithRequest, TokenPayload } from './types';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersRepository: UsersRepository,
    private usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(user: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await this.usersService.create({
      ...user,
      password: hashedPassword,
    });
    // createdUser.password = undefined;
    return createdUser;
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    const user = await this.usersRepository.findUserByEmail(email);
    if (!user)
      throw new BadRequestException('O Email informado não foi encontrado');
    await this.verifyPassword(plainTextPassword, user.password);
    user.password = undefined;
    return user;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Credenciais informadas não são válidas!');
    }
  }

  login(
    credentials: LoginCredentialsWithRequest,
    response: Response,
  ) {
    const cookie = this.getCookieWithJwtToken(
      credentials.user._id.toString(),
    );
    response.setHeader('Set-Cookie', cookie);
    response.status(200).json(credentials.user)
  }

  public getCookieWithJwtToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }
}
