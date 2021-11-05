import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UsersRepository } from 'src/api/users';
import { populateRelations } from 'src/database/populate-relations.util';
import {
  convertToMongoId,
  isFromClass,
  isPureArrayOfClass,
  isValidMongoId,
} from 'src/Utils';
import { CreateCommentDto } from '../dto';
import { Classroom } from '../entities';
import { CommentRepository } from '../repositories';
import { PostService } from '../services';
import {
  getPopulateComments,
  isUserInClassroom,
  POPULATE_PATHS,
} from '../utils';
@Injectable()
export class CommentService {
  constructor(
    private readonly postService: PostService,
    private readonly userRepository: UsersRepository,
    private readonly commentRepository: CommentRepository,
  ) {}
  readonly commentPopulateWithoutClassroom = getPopulateComments(
    false,
    '-classroom',
  );
  async findAll() {
    return {
      comments: await populateRelations(
        this.commentRepository.find(),
        this.commentPopulateWithoutClassroom,
      ),
    };
  }

  async validateIfUserCanAddCommentaryOnPost(
    createCommentDto: CreateCommentDto,
  ) {
    const post = await this.postService.findOne(createCommentDto.postId);

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

    return await this.commentRepository
      .create({
        ...createCommentDto,
        post: createCommentDto.postId,
        author: createCommentDto.authorId,
      })
      .then((comment) =>
        comment.populate(this.commentPopulateWithoutClassroom),
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
    return deleted.populate(this.commentPopulateWithoutClassroom);
  }

  async getCommentsByPost(postId: string) {
    const post = await this.postService.findOne(postId);
    return {
      comments: await this.commentRepository
        .find({ post: post._id })
        .populate(this.commentPopulateWithoutClassroom),
    };
  }
}
