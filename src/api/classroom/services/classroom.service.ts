import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Document, Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { UsersService, UserType } from 'src/api/users';
import { populateRelations } from 'src/database/populate-relations.util';
import { isValidMongoId } from 'src/Utils';
import { User } from '../../users';
import { CreateClassroomDto } from '../dto/create-classroom.dto';
import { UpdateClassroomDto } from '../dto/update-classroom.dto';
import { ClassroomRepository, PostRepository } from '../repositories';
import { POPULATE_PATHS } from '../utils';
@Injectable()
export class ClassroomService {
  constructor(
    private readonly classroomRepository: ClassroomRepository,
    private readonly userService: UsersService,
    private readonly postRepository: PostRepository,
  ) {}

  async findAll() {
    return {
      classrooms: await this.classroomRepository
        .find()
        .populate('teacher')
        .populate('members')
        .exec(),
    };
    // return { classrooms };
  }

  teacherVerification(
    user?: User &
      Document<any, any, any> & {
        _id: any;
      },
    isEdit?: boolean,
  ) {
    if (user?.type !== UserType.T)
      throw new ForbiddenException(
        `Apenas usuários do tipo Professor podem ${
          isEdit ? 'editar' : 'cadastrar'
        } salas.`,
      );
  }
  async update(id: string, updateClassroomDto: UpdateClassroomDto) {
    const user = await this.userService.getById(updateClassroomDto.teacherId);
    this.teacherVerification(user);
    delete updateClassroomDto.teacherId;
    const document = await this.classroomRepository.findOneAndUpdate(
      { _id: id },
      updateClassroomDto,
    );
    if (!document)
      throw new NotFoundException(
        'Não foi possível encontrar uma classe com o ID informado!',
      );

    return populateRelations(document, POPULATE_PATHS.CLASSROOM);
  }

  async findOne(id: string) {
    isValidMongoId(id);
    const document = await this.classroomRepository.findOne({ _id: id });
    if (!document)
      throw new NotFoundException(
        'Não foi possível encontrar uma classe com o ID informado.',
      );
    return populateRelations(document, POPULATE_PATHS.CLASSROOM);
  }

  async create(createClassroomDto: CreateClassroomDto) {
    const teacher = await this.userService.getById(
      createClassroomDto.teacherId,
    );

    this.teacherVerification(teacher);

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

    return await this.classroomRepository.create({
      ...createClassroomDto,
      teacher,
      members: [],
      code: nanoid(11), // 11 length UUID
    });
  }

  async deleteOne(id: string) {
    const deleted = await this.classroomRepository.deleteAndReturnDocument({
      _id: id,
    });

    if (!deleted)
      throw new NotFoundException(
        'Não foi possivel encontrar uma classe com o ID informado!',
      );
    return populateRelations(deleted, POPULATE_PATHS.CLASSROOM);
  }

  async getPostsByClass(classId: string) {
    isValidMongoId(classId);
    const posts = await this.postRepository.findByClass(classId);
    return {
      posts,
    };
  }

  async classesByUsers(userId: string, isTeacher: boolean) {
    isValidMongoId(userId);
    const teacherOrMember = new Types.ObjectId(userId);
    const query: { [x: string]: any } = {};
    if (isTeacher) query['teacher'] = teacherOrMember;
    else query['members'] = { $in: teacherOrMember };
    return {
      classrooms: await populateRelations(
        this.classroomRepository.find(query),
        POPULATE_PATHS.CLASSROOM,
      ),
    };
  }
}
