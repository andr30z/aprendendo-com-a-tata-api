import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

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

  getById(id: string) {
    console.log(id, 'alskdjklasjd')
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
}
