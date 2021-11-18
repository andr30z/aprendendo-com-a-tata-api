import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsWithRequest } from '../authentication/types';
import { isValidMongoId } from 'src/utils';
import { FilesService } from '../files';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository,
    private readonly filesService: FilesService) { }

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findUserByEmail(
      createUserDto.email,
    );
    if (user) throw new ConflictException('Endereço de email já cadastrado!');
    return this.usersRepository.create(createUserDto);
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
    const document = await this.usersRepository.findOneOrThrow({ _id: id },
      () => new NotFoundException('Usuário não encontrado'));
    this.filesService.verifyAndUpdatePathFile(updateUserDto.profilePhoto, document.profilePhoto)
    return this.usersRepository.findOneAndUpdate({ _id: id }, updateUserDto);
  }

  async remove(id: string) {
    const deletedUser = await this.usersRepository.deleteAndReturnDocument({ _id: id })

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
