import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Classroom } from '../entities';
import { UsersRepository, User } from 'src/api/users';
import { populateRelations } from 'src/database/populate-relations.util';
import { isFromClass, isPureArrayOfClass, isValidMongoId } from 'src/Utils';
import { CreateCommentDto } from '../dto';
import { CommentRepository, PostRepository } from '../repositories';
import { isUserInClassroom, POPULATE_PATHS } from '../utils';

@Injectable()
export class CommentService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UsersRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async findAll() {
    return {
      comments: await populateRelations(
        this.commentRepository.find(),
        POPULATE_PATHS.COMMENT,
      ),
    };
  }

  async validateIfUserCanAddCommentaryOnPost(
    createCommentDto: CreateCommentDto,
  ) {
    const post = await this.postRepository
      .findOneWithPromise({
        _id: createCommentDto.postId,
      })
      .populate(POPULATE_PATHS.POST)
      .exec();
    if (!post)
      return new NotFoundException('O ID do Post informado não existe!');

    const classroom = post.classroom;
    if (
      !isFromClass<Classroom>(classroom, 'teacher') ||
      !isFromClass<User>(classroom?.teacher, 'email') ||
      !isPureArrayOfClass<User>(classroom?.members, 'email')
    )
      return new Error('Invalid Classroom object');

    if (!isUserInClassroom(classroom, createCommentDto.authorId))
      return new BadRequestException(
        'Não é possível criar comentários em posts de classes ao qual o usuário não faz parte!',
      );
  }

  async create(createCommentDto: CreateCommentDto) {
    isValidMongoId(createCommentDto.authorId);
    isValidMongoId(createCommentDto.postId);
    await this.userRepository.findOneOrThrow(
      {
        _id: createCommentDto.authorId,
      },
      () =>
        new NotFoundException(
          `Usuário de ID: ${createCommentDto.authorId} não existe!`,
        ),
    );

    const isInvalidError = await this.validateIfUserCanAddCommentaryOnPost(
      createCommentDto,
    );
    if (isInvalidError) throw isInvalidError;

    return populateRelations(
      await this.commentRepository.create({
        ...createCommentDto,
        post: createCommentDto.postId,
        author: createCommentDto.authorId,
      }),
      POPULATE_PATHS.COMMENT,
    );
  }

  async deleteOne(id: string) {
    isValidMongoId(id);
    const deleted = await this.commentRepository.deleteAndReturnDocument({
      _id: id,
    });

    if (!deleted)
      throw new NotFoundException(
        'Não foi possivel encontrar um comentário com o ID informado!',
      );
    return populateRelations(deleted, POPULATE_PATHS.COMMENT);
  }
}
