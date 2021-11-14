import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Document, Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { UsersService, UserType } from 'src/api/users';
import { populateRelations } from 'src/database/populate-relations.util';
import { isValidMongoId } from 'src/utils';
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
    const document = await this.classroomRepository.findOneOrThrow(
      { _id: id },
      () =>
        new NotFoundException(
          'Não foi possível encontrar uma classe com o ID informado.',
        ),
    );
    return document.populate(POPULATE_PATHS.CLASSROOM);
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
      pendingJoinRequests: [],
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
    console.log("TESTE")
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

  async acceptUserJoinRequest(
    classroomId: string,
    userToJoinId: string,
    currentUser: User,
  ) {
    const currentUserId = currentUser._id.toString();
    console.log(currentUser);
    const classroom = await this.findOne(classroomId);
    if (!classroom.teacher._id.equals(currentUserId)) {
      throw new ForbiddenException(
        `Apenas o professor da sala de ID: ${classroom._id.toString()} pode aprovar novos membros!`,
      );
    }
    const userToJoin = await this.userService.getById(userToJoinId);

    if (classroom.members.find((x) => x._id.equals(userToJoin._id.toString())))
      throw new ConflictException('O usuário já se encontra presente na sala!');

    const userJoinRequestPosition = classroom.pendingJoinRequests.findIndex(
      (x) => x._id.equals(userToJoin._id.toString()),
    );

    if (userJoinRequestPosition === -1)
      throw new BadRequestException(
        'O usuário não está na lista de pedidos para se juntar a sala',
      );

    //remove new member from pending request array
    classroom.pendingJoinRequests.splice(userJoinRequestPosition, 1);
    classroom.members.push(userToJoin._id);

    return await classroom.save();
  }

  throwErrorIfUserIsInArray(
    array: Types.ObjectId[],
    userId: string,
    msg?: string,
  ) {
    if (array.find((member) => member._id.toString() === userId))
      throw new ConflictException(msg || 'O usuário já é membro da classe.');
  }
  async classroomInviteRequest(classroomId: string, currentUser: User) {
    isValidMongoId(classroomId);
    const classroom = await this.findOne(classroomId);
    const userId = currentUser._id.toString();
    this.throwErrorIfUserIsInArray(
      classroom.pendingJoinRequests,
      userId,
      'O Usuário já possui um pedido pendente para entrar na classe.',
    );

    this.throwErrorIfUserIsInArray(classroom.members, userId);

    classroom.pendingJoinRequests.push(currentUser._id as any);
    await classroom.save();

    return { message: 'Pedido registrado com sucesso', success: true };
  }
}
