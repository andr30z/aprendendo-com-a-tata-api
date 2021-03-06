import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsWithRequest } from '../../authentication/types';
import { isValidMongoId } from 'src/utils';
import { FilesService } from '../../files';
import { nanoid } from 'nanoid';
import { User } from '../entities';
import { UserType } from '../types';
import { ChangePasswordDto } from '../dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findUserByEmail(
      createUserDto.email,
    );
    if (user) throw new ConflictException('Endereço de email já cadastrado!');

    return this.usersRepository.create({ ...createUserDto, code: nanoid(11) });
  }

  userIsChildren(user: User) {
    return user.type === UserType.C;
  }

  userIsResponsible(user: User) {
    return user.type === UserType.R;
  }

  userIsTeacher(user: User) {
    return user.type === UserType.T;
  }

  getByCode(userCode: string) {
    return this.usersRepository.findOneOrThrow(
      { code: userCode },
      () =>
        new NotFoundException(
          'Usuário não encontrado, verifique o código informado!',
        ),
    );
  }

  async findAll() {
    return { users: await this.usersRepository.find() };
  }
  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.updateOne(
      { _id: userId },
      {
        $set: { currentHashedRefreshToken },
      },
      { strict: false },
    );
  }

  async changePassword(
    currentUser: User,
    changePasswordDto: ChangePasswordDto,
  ) {
    const passwordsAreEqual = await bcrypt.compare(
      changePasswordDto.currentPassword,
      currentUser.password,
    );
    if (!passwordsAreEqual)
      throw new BadRequestException(
        'A senha atual informada não é igual a senha registrada!',
      );
    await this.usersRepository.updateOne(
      { _id: currentUser._id },
      {
        password: await bcrypt.hash(changePasswordDto.newPassword, 10),
      },
    );

    return {
      message: 'Senha atualizada com sucesso!',
    };
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getById(userId);
    const doc = user.toObject();
    // console.log('after', user, userId, doc.currentHashedRefreshToken);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      doc.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  getById(id: string) {
    isValidMongoId(id, 'Id informado não atende aos requisitos do MongoDB');
    return this.usersRepository.findOneOrThrow(
      { _id: id },
      () => new NotFoundException('Usuário não encontrado'),
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const document = await this.usersRepository.findOneOrThrow(
      { _id: id },
      () => new NotFoundException('Usuário não encontrado'),
    );
    this.filesService.verifyAndUpdatePathFile(
      updateUserDto.profilePhoto,
      document.profilePhoto,
    );
    delete updateUserDto.password;
    return this.usersRepository.findOneAndUpdate({ _id: id }, updateUserDto, {
      new: true,
    });
  }

  async remove(id: string) {
    const deletedUser = await this.usersRepository.deleteAndReturnDocument({
      _id: id,
    });

    if (!deletedUser)
      throw new NotFoundException(
        'Não foi possivel encontrar uma classe com o ID informado!',
      );

    this.filesService.deleteFile(deletedUser.profilePhoto);
    return deletedUser;
  }

  async removeRefreshToken(userId: string) {
    return this.usersRepository.findOneAndUpdate(
      { _id: userId },
      {
        currentHashedRefreshToken: null,
      },
    );
  }

  me(req: LoginCredentialsWithRequest) {
    return req.user;
  }
}
