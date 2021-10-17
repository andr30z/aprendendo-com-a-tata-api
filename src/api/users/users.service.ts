import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsWithRequest } from '../authentication/types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findUserByEmail(
      createUserDto.email,
    );
    if (user) throw new ConflictException('Endereço de email já cadastrado!');
    return this.usersRepository.create(createUserDto);
  }

  findAll() {
    return this.usersRepository.find();
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
    console.log('id', id)
    if (!isValidObjectId(id))
      throw new BadRequestException(
        'Id informado não atende aos requisitos do MongoDB',
      );
    return this.usersRepository.findOne({ _id: id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.findOneAndUpdate({ _id: id }, updateUserDto);
  }

  remove(id: string) {
    return this.usersRepository.deleteOne({ _id: id });
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
