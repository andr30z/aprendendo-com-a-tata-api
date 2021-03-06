import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PopulateOptions, Types } from 'mongoose';
import {
  ActivitiesService,
  ActivityResultRepository,
  ActivityResultService,
} from 'src/api/activities';
import { POPULATE_PATH_ACTIVITY_RESULT } from 'src/api/activities/utils';
import { UsersService } from 'src/api/users';
import { populateRelations } from 'src/database/populate-relations.util';
import { convertToMongoId, isFromClass, isValidMongoId } from 'src/utils';
import { CreatePostDto, StartActivityDto, UpdatePostDto } from '../dto';
import { Classroom } from '../entities';
import { PostRepository } from '../repositories';
import { ClassroomService } from '../services/classroom.service';
import { PostActivityResult, PostTypes } from '../types';
import {
  isUserInClassroom,
  POPULATE_PATHS,
  resolveActivityResult,
  startActivityValidation,
} from '../utils';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UsersService,
    private readonly classroomService: ClassroomService,
    private readonly activitiesService: ActivitiesService,
    private readonly activityResultService: ActivityResultService,
    private readonly activityResultRepository: ActivityResultRepository,
  ) {}

  readonly populateWithoutActivityObject = [
    ...POPULATE_PATHS.POST,
    { path: 'activities', model: 'Activity', select: '_id name difficulty color' },
  ];
  async findAll() {
    return {
      posts: await this.postRepository
        .find()
        .select('-postActivityResult')
        .populate(this.populateWithoutActivityObject)
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
        'N??o foi poss??vel encontrar um post com o ID informado!',
      );

    return populateRelations(document, this.populateWithoutActivityObject);
  }

  async findOne(id: string, hidePostActivityResult = false) {
    isValidMongoId(id);
    const post = await this.postRepository.findOneOrThrow(
      { _id: id },
      () => new NotFoundException('Post n??o encontrado!'),
      hidePostActivityResult ? '-postActivityResult' : undefined,
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
        `Usu??rio de ID: ${createPostDto.authorId} n??o existe`,
      );
    const classroom = await this.classroomService.findOne(
      createPostDto.classroomId,
    );
    if (!classroom)
      throw new NotFoundException(
        `Classe de ID: ${createPostDto.classroomId} n??o existe`,
      );

    if (
      createPostDto.activities &&
      (await this.allActivitiesExists(createPostDto.activities))
    )
      throw new NotFoundException('Uma ou mais atividades n??o existem!');

    if (!isFromClass<Classroom>(classroom, 'code'))
      throw new Error('Wrong return from classroom service');

    if (!isUserInClassroom(classroom, createPostDto.authorId))
      throw new BadRequestException(
        'N??o ?? poss??vel criar posts em classes ao qual o usu??rio n??o faz parte!',
      );
    const post = await this.postRepository.create({
      ...createPostDto,
      activities:
        PostTypes.A === createPostDto.type
          ? createPostDto.activities || []
          : null,
      author: createPostDto.authorId,
      classroom: createPostDto.classroomId,
      postActivityResult: createPostDto.type === PostTypes.A ? [] : null,
      allowComments:
        createPostDto.allowComments === undefined
          ? true
          : createPostDto.allowComments,
    });

    return await post.populate(this.populateWithoutActivityObject);
  }

  getPostWithActivityResultPopulate(
    postId: string,
    otherPopulates: Array<PopulateOptions> = [],
  ) {
    return this.findOne(postId).then((p) =>
      p.populate([
        {
          path: 'postActivityResult',
          model: 'PostActivityResult',
          populate: [
            {
              path: 'activitiesResult',
              model: 'ActivityResult',
              // select: '-user',
              populate: POPULATE_PATH_ACTIVITY_RESULT,
            },
            {
              path: 'user',
              model: 'User',
              // select: '-password -currentHashedRefreshToken',
            },
          ],
        },
        ...otherPopulates,
      ]),
    );
  }

  async getUserActivityResultsFromUserByPost(postId: string, userId: string) {
    await this.userService.getById(userId);
    const post = await this.getPostWithActivityResultPopulate(postId);
    if (post.type !== PostTypes.A)
      throw new BadRequestException('O post informado n??o possui atividades!');
    const results = post.postActivityResult;
    const userActivities = results.filter((postActivityResult) =>
      postActivityResult.user._id.equals(userId),
    );
    return {
      postActivityResults: userActivities,
    };
  }

  async startActivity(postId: string, startActivityDto: StartActivityDto) {
    const user = await this.userService.getById(startActivityDto.userId);
    const post = await this.getPostWithActivityResultPopulate(postId, [
      {
        path: 'classroom',
        model: 'Classroom',
        select: 'teacher members',
      },
      {
        path: 'postActivityResult',
        model: 'PostActivityResut',
        populate: [
          {
            path: 'activitiesResult',
            model: 'ActivityResult',
          },
        ],
      },
    ]);

    const postActivities =
      post.postActivityResult || ([] as Types.Array<PostActivityResult>);
    startActivityValidation(post, startActivityDto);
    const userPostActivityResultIndex = postActivities.findIndex((p) =>
      p.user._id.equals(startActivityDto.userId),
    );
    const activityResult = await this.activityResultRepository.create({
      ...startActivityDto,
      activity: convertToMongoId(startActivityDto.activityId),
      user: user._id,
      result: 0,
    });
    if (userPostActivityResultIndex === -1)
      postActivities.push({
        user: user._id,
        activitiesResult: [activityResult._id],
      });
    else {
      const postActivityResultItem =
        postActivities[userPostActivityResultIndex];
      postActivities[userPostActivityResultIndex] = {
        ...postActivityResultItem,
        user: postActivityResultItem.user,
        activitiesResult: resolveActivityResult(
          activityResult._id,
          startActivityDto.activityId,
          postActivityResultItem.activitiesResult as any,
        ),
      };
    }

    post.postActivityResult = postActivities;
    await post.save();
    await activityResult.populate([
      {
        path: 'activity',
        model: 'Activity',
        select: '_id',
      },
      'user',
    ]); //populate here to avoid unecessary populations in case of errors
    return {
      success: true,
      message: 'Atividade iniciada com sucesso!',
      activityResult,
    };
  }

  async deleteOne(id: string) {
    isValidMongoId(id);
    const deleted = await this.postRepository.deleteAndReturnDocument({
      _id: id,
    });

    if (!deleted)
      throw new NotFoundException(
        'N??o foi possivel encontrar um post com o ID informado!',
      );
    return populateRelations(deleted, this.populateWithoutActivityObject);
  }
}
