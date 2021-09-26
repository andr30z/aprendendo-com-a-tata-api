import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthenticationGuard extends AuthGuard('local') {
  handleRequest(_err: any, user: any, _info: any) {
    if (user === false)
      throw new BadRequestException(
        'Verifique as credenciais. Email ou senha não informados.',
      );
    if (user === undefined)
      throw new NotFoundException(
        'Usuário não encontrado, verifique as credenciais informadas.',
      );
    return user;
  }
}
