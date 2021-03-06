import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Document, Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { Classroom } from '../entities';
import { UsersService, UserType } from 'src/api/users';
import { populateRelations } from 'src/database/populate-relations.util';
import { isValidMongoId } from 'src/utils';
import { User } from '../../users';
import { CreateClassroomDto } from '../dto/create-classroom.dto';
import { UpdateClassroomDto } from '../dto/update-classroom.dto';
import { ClassroomRepository, PostRepository } from '../repositories';
import { isClassroomTeacher, POPULATE_PATHS } from '../utils';
import { FilesService } from 'src/api/files';
@Injectable()
export class ClassroomService {
  constructor(
    private readonly classroomRepository: ClassroomRepository,
    private readonly userService: UsersService,
    private readonly postRepository: PostRepository,
    private readonly filesService: FilesService,
  ) { }

  async findAll(code?: string) {
    const query = code ? { code: new RegExp(code, 'i') } : undefined;
    return {
      classrooms: await this.classroomRepository
        .find(query)
        .select('-pendingJoinRequests -classPhoto')
        .populate(POPULATE_PATHS.CLASSROOM)
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
        `Apenas usuários do tipo Professor podem ${isEdit ? 'editar' : 'cadastrar'
        } salas.`,
      );
  }
  async update(id: string, updateClassroomDto: UpdateClassroomDto) {
    const user = await this.userService.getById(updateClassroomDto.teacherId);
    this.teacherVerification(user);
    delete updateClassroomDto.teacherId;
    const document = await this.classroomRepository.findOneOrThrow(
      { _id: id },
      () => new NotFoundException(
        'Não foi possível encontrar uma classe com o ID informado!',
      )
    );

    this.filesService.verifyAndUpdatePathFile(updateClassroomDto.classPhoto,
      document.classPhoto);
    const updatedDocument = await this.classroomRepository.findOneAndUpdate({ _id: id }, updateClassroomDto);
    return updatedDocument.populate(POPULATE_PATHS.CLASSROOM);
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
    this.filesService.locateAndUpdateTmpFileLocation(createClassroomDto.classPhoto, false);
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
    this.filesService.deleteFile(deleted.classPhoto)
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


  async acceptOrDenyUserJoinRequest(
    classroomId: string,
    userToJoinOrDeleteId: string,
    currentUser: User,
    isDenyRequest: boolean = false
  ) {
    const currentUserId = currentUser._id.toString();
    const classroom = await this.findOne(classroomId);
    isClassroomTeacher(classroom, currentUserId);
    const userToJoinOrDelete = await this.userService.getById(userToJoinOrDeleteId);

    if (classroom.members.find((x) => x._id.equals(userToJoinOrDelete._id.toString())))
      throw new ConflictException('O usuário já se encontra presente na sala!');

    const userJoinRequestPosition = classroom.pendingJoinRequests.findIndex(
      (x) => x._id.equals(userToJoinOrDelete._id.toString()),
    );

    if (userJoinRequestPosition === -1)
      throw new BadRequestException(
        'O usuário não está na lista de pedidos para se juntar a sala',
      );

    //remove new member from pending request array
    classroom.pendingJoinRequests.splice(userJoinRequestPosition, 1);
    if (!isDenyRequest)
      classroom.members.push(userToJoinOrDelete._id);

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

  async leaveClassroom(classroomId: string, userId: string) {
    const classroom = await this.findOne(classroomId);
    return this.executeRemoveUserFromClassOperation(classroom, userId)
  }

  async executeRemoveUserFromClassOperation(classroom: Classroom & Document<any, any, any> & {
    _id: any;
  }, userId: string) {
    const removePosition = classroom.members.findIndex(user => user._id.equals(userId))
    if (removePosition === -1)
      throw new NotFoundException("Não foi possível encontrar o usuário de ID: " + userId + " na classe.");

    classroom.members.splice(removePosition, 1)
    await classroom.save();
    return { success: true, message: "Usuário removido com sucesso" }
  }

  async removeUserFromClassroom(classroomId: string, userToRemoveId: string, currentUser: User) {
    const classroom = await this.findOne(classroomId);
    isClassroomTeacher(classroom, currentUser._id.toString());
    return this.executeRemoveUserFromClassOperation(classroom, userToRemoveId)
  }
}
