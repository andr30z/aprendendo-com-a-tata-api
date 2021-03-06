import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersService, UserResponsibleService, User } from 'src/api/users';
import { isFromClass, isValidMongoId } from 'src/utils';
import { ActivitiesService } from './activities.service';
import { UpdateActivityResultDto, FinishActivityResultDto } from '../dto';
import { ActivityResultRepository } from '../repositories';
import { activityResultLogic, POPULATE_PATH_ACTIVITY_RESULT } from '../utils';
import { PaginationParams } from 'src/database/pagination-params';

@Injectable()
export class ActivityResultService {
  constructor(
    private readonly activityResultRepository: ActivityResultRepository,
    private readonly activitiesService: ActivitiesService,
    private readonly userService: UsersService,
    private readonly usersResponsibleService: UserResponsibleService,
  ) {}
  async findAll() {
    const activityResults = await this.activityResultRepository.find();
    return { activityResults };
  }

  findOne(id: string) {
    isValidMongoId(id);
    return this.activityResultRepository.findOneOrThrow(
      { _id: id },
      () => new NotFoundException('Atividade não encontrada'),
    );
  }

  async finishActivity(
    userId: string,
    finishActivityResultDto: FinishActivityResultDto,
  ) {
    this.userService.getById(userId);
    const activity = await this.activitiesService.findOne(
      finishActivityResultDto.activityId,
    );
    const result = activityResultLogic(
      finishActivityResultDto.activityAnswers,
      activity,
    );

    return await this.activityResultRepository.create({
      user: userId,
      finished: true,
      activity: activity._id,
      result,
      activityAnswers: finishActivityResultDto.activityAnswers,
    });
  }

  async updateActivityResult(
    userId: string,
    activityResultDto: UpdateActivityResultDto,
  ) {
    const activityResult = await this.activityResultRepository.findOneOrThrow(
      {
        _id: activityResultDto.activityResultId,
        user: userId,
      },
      () =>
        new NotFoundException(
          'Não foi possivel encontrar um resultado de atividade ',
        ),
    );
    const activity = await this.activitiesService.findOne(
      activityResultDto.activityId,
    );
    let result: number = 0;
    //logic to get activity result
    if (activityResultDto.finished)
      result = activityResultLogic(activityResultDto.activityAnswers, activity);
    activityResult.result = result;
    activityResult.finished = activityResultDto.finished;
    activityResult.activityAnswers = activityResultDto.activityAnswers;
    return (await activityResult.save()).populate([
      {
        path: 'activity',
        model: 'Activity',
        select: '_id name difficulty',
      },
      'user',
    ]);
  }

  async getChildActivitiesResultsByResponsibleUserId(
    responsibleUserId: string,
    pagination: PaginationParams,
  ) {
    const userResponsible = await this.usersResponsibleService
      .findOne(responsibleUserId)
      .then((responsibleDoc) =>
        responsibleDoc.populate(['responsibleUser', 'child']),
      );
    if (!isFromClass<User>(userResponsible.child, 'name'))
      throw new Error('Failed to populate child object');

    return this.findManyByUserId(
      userResponsible.child._id.toString(),
      pagination,
    );
  }

  async findManyByUserId(
    userId: string,
    { page, limit, sort }: PaginationParams,
  ) {
    const result = await this.activityResultRepository.paginate(
      {
        user: userId,
      },
      { page, limit, sort },
      POPULATE_PATH_ACTIVITY_RESULT,
    );

    return result;
  }

  async findManyById(arrayOfIds: Array<Types.ObjectId>) {
    const activityResults = await this.activityResultRepository.find({
      _id: { $in: arrayOfIds },
    });

    return { activityResults };
  }
}
