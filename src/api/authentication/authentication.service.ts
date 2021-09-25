import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { CreateUserDto, UsersRepository, UsersService, User } from '../users';
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

  login(credentials: LoginCredentialsWithRequest, response: Response) {
    console.log(credentials.user)
    const accessTokenCookie = this.getCookieWithJwtToken(
      credentials.user._id.toString(),
    );
    const refreshTokenCookie = this.getCookieWithJwtRefreshToken(
      credentials.user._id.toString(),
    );
    this.usersService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      credentials.user._id.toString(),
    );
    response.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);
    const user = credentials.user;
    user.currentHashedRefreshToken = undefined;
    response.status(200).json(user);
  }

  getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  getCookieWithJwtToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  getCookieWithJwtRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;
    return {
      cookie,
      token,
    };
  }

  refresh(request: LoginCredentialsWithRequest, response: Response) {
    console.log(request.user)
    const accessTokenCookie = this.getCookieWithJwtToken(
      request.user._id.toString(),
    );

    const user = request.user;
    user.currentHashedRefreshToken = undefined;
    user.password = undefined;
    response.setHeader('Set-Cookie', accessTokenCookie);
    response.status(200).json(user);
  }

  async logout(request: LoginCredentialsWithRequest, response: Response) {
    await this.usersService.removeRefreshToken(request.user._id.toString());
    response.setHeader('Set-Cookie', this.getCookiesForLogOut());
  }
}
