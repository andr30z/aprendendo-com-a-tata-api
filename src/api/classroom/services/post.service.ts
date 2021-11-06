import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Types } from 'mongoose';
import {
  ActivitiesService,
  ActivityResult,
  ActivityResultService
} from 'src/api/activities';
import { UsersService } from 'src/api/users';
import { populateRelations } from 'src/database/populate-relations.util';
import { isFromClass, isValidMongoId } from 'src/utils';
import { CreatePostDto, UpdatePostDto } from '../dto';
import { Classroom } from '../entities';
import { PostRepository } from '../repositories';
import { ClassroomService } from '../services/classroom.service';
import { isUserInClassroom, POPULATE_PATHS } from '../utils';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UsersService,
    private readonly classroomService: ClassroomService,
    private readonly activitiesService: ActivitiesService,
    private readonly activityResultService: ActivityResultService,
  ) {}

  readonly populateWithoutActivityObject = [
    ...POPULATE_PATHS.POST,
    { path: 'activities', model: 'Activity', select: '_id' },
  ];
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

    return populateRelations(document, this.populateWithoutActivityObject);
  }

  async findOne(id: string) {
    isValidMongoId(id);
    const post = await this.postRepository.findOneOrThrow(
      { _id: id },
      () => new NotFoundException('Post não encontrado!'),
    );
    return post.populate(this.populateWithoutActivityObject);
  }

  async allActivitiesExists(dtoActivities: Types.ObjectId[]) {
    const activites = await this.activitiesService
      .findManyById(dtoActivities)
      .then((a) => a.activities.map((act) => act._id));
    return activites.length !== dtoActivities.length;
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

    if (
      createPostDto.activities &&
      (await this.allActivitiesExists(createPostDto.activities))
    )
      throw new NotFoundException('Uma ou mais atividades não existem!');

    if (!isFromClass<Classroom>(classroom, 'code'))
      throw new Error('Wrong return from classroom service');

    if (!isUserInClassroom(classroom, createPostDto.authorId))
      throw new BadRequestException(
        'Não é possível criar posts em classes ao qual o usuário não faz parte!',
      );
    const post = await this.postRepository.create({
      ...createPostDto,
      author: createPostDto.authorId,
      classroom: createPostDto.classroomId,
      allowComments:
        createPostDto.allowComments === undefined
          ? true
          : createPostDto.allowComments,
    });

    return await post.populate(this.populateWithoutActivityObject);
  }

  async getUserActivityResultsFromUserByPost(postId: string, userId: string) {
    const user = await this.userService.getById(userId);
    const post = await this.findOne(postId).then((p) =>
      p.populate('activitiesResult'),
    );
    if (!post.activities || !post.activitiesResult)
      throw new BadRequestException('O post informado não possui atividades!');
    const results = post.activitiesResult;

    const userActivities = results.filter((activityResult) => {
      if (isFromClass<ActivityResult>(activityResult, 'activityAnswer'))
        return activityResult.user._id === user._id;
      else throw new Error('Wrong return from post repository!');
    });
    return {
      activitiesResults: userActivities,
    };
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
    return populateRelations(deleted, this.populateWithoutActivityObject);
  }
}
