import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/api/users';
import { populateRelations } from 'src/database/populate-relations.util';
import { isFromClass, isValidMongoId } from 'src/Utils';
import { CreatePostDto, UpdatePostDto } from '../dto';
import { PostRepository } from '../repositories';
import { ClassroomService } from '../services/classroom.service';
import { isUserInClassroom, POPULATE_PATHS } from '../utils';
import { Classroom } from '../entities';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UsersService,
    private readonly classroomService: ClassroomService,
  ) {}
  async findAll() {
    return {
      posts: await this.postRepository
        .find()
        .populate(POPULATE_PATHS.POST)
        .exec(),
    };
  }

  async update(id: string, updateUserDto: UpdatePostDto) {
    isValidMongoId(id);
    delete updateUserDto.authorId;
    delete updateUserDto._id;
    delete updateUserDto.classroomId;
    const document = await this.postRepository.findOneAndUpdate(
      { _id: id },
      updateUserDto,
    );
    if (!document)
      throw new NotFoundException(
        'Não foi possível encontrar um post com o ID informado!',
      );

    return populateRelations(document, POPULATE_PATHS.POST);
  }

  async findOne(id: string) {
    isValidMongoId(id);
    const post = await this.postRepository.findOne({ _id: id });
    if (!post) throw new NotFoundException('Post não encontrado!');
    return populateRelations(post, POPULATE_PATHS.POST);
  }

  async create(createPostDto: CreatePostDto) {
    const user = await this.userService.getById(createPostDto.authorId);
    if (!user)
      throw new NotFoundException(
        `Usuário de ID: ${createPostDto.authorId} não existe`,
      );
    const classroom = await this.classroomService.findOne(
      createPostDto.classroomId,
    );
    if (!classroom)
      throw new NotFoundException(
        `Classe de ID: ${createPostDto.classroomId} não existe`,
      );

    if (!isFromClass<Classroom>(classroom, 'code'))
      throw new Error('Wrong return from classroom service');

    if (!isUserInClassroom(classroom, createPostDto.authorId))
      throw new BadRequestException(
        'Não é possível criar posts em classes ao qual o usuário não faz parte!',
      );
    return populateRelations(
      await this.postRepository.create({
        ...createPostDto,
        author: createPostDto.authorId,
        classroom: createPostDto.classroomId,
        allowComments:
          createPostDto.allowComments === undefined
            ? true
            : createPostDto.allowComments,
      }),
      POPULATE_PATHS.POST,
    );
  }

  async deleteOne(id: string) {
    isValidMongoId(id);
    const deleted = await this.postRepository.deleteAndReturnDocument({
      _id: id,
    });

    if (!deleted)
      throw new NotFoundException(
        'Não foi possivel encontrar um post com o ID informado!',
      );
    return populateRelations(deleted, POPULATE_PATHS.POST);
  }
}
