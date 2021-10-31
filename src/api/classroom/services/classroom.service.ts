import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { nanoid } from 'nanoid';
import { UsersService, UserType } from 'src/api/users';
import { CreateClassroomDto } from '../dto/create-classroom.dto';
import { UpdateClassroomDto } from '../dto/update-activity.dto';
import { ClassroomRepository } from '../repositories';

@Injectable()
export class ClassroomService {
  constructor(
    private readonly classroomRepository: ClassroomRepository,
    private readonly userService: UsersService,
  ) {}
  async findAll() {
    const classroom = await this.classroomRepository.find();
    return { classroom };
  }

  async update(id: string, updateUserDto: UpdateClassroomDto) {
    delete updateUserDto.teacherId;
    const document = await this.classroomRepository.findOneAndUpdate(
      { _id: id },
      updateUserDto,
    );
    if (!document)
      throw new NotFoundException(
        'Não foi possível encontrar uma classe com o ID informado!',
      );

    await document.populate('teacher');
    await document.populate('members');
    return document;
  }

  findOne(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('ID informado é inválido!');
    return this.classroomRepository
      .findOneWithPromise({ _id: id })
      .populate('teacher')
      .populate('members')
      .exec();
  }

  async create(createClassroomDto: CreateClassroomDto) {
    const teacher = await this.userService.getById(
      createClassroomDto.teacherId,
    );
    if (teacher.type !== UserType.T)
      throw new ForbiddenException(
        'Apenas usuários do tipo Professor podem cadastrar salas.',
      );

    if (
      await this.classroomRepository.findClassByNameAndUser(
        createClassroomDto.name,
        teacher._id,
      )
    )
      throw new ConflictException(
        'Já existe uma classe vinculada a este professor com o nome ' +
          createClassroomDto.name,
      );
    if (!teacher) throw new NotFoundException('Professor não encontrado.');
    return this.classroomRepository.create({
      ...createClassroomDto,
      teacher,
      members: [],
      code: nanoid(11),
    });
  }

  async deleteOne(id: string) {
    const deleted = await this.classroomRepository.deleteOne({ _id: id });
    if (deleted.deletedCount === 0)
      throw new NotFoundException(
        'Não foi possivel encontrar uma classe com o ID informado!',
      );
    return { success: true };
  }
}
