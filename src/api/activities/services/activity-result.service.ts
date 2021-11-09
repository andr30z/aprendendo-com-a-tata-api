import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersService } from 'src/api/users';
import { isValidMongoId } from 'src/utils';
import { ActivitiesService } from '.';
import { UpdateActivityResultDto } from '../dto';
import { ActivityResultRepository } from '../repositories';
import { activityResultLogic } from '../utils';

@Injectable()
export class ActivityResultService {
  constructor(
    private readonly activityResultRepository: ActivityResultRepository,
    private readonly activitiesService: ActivitiesService,
    private readonly userService: UsersService,
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
    //logic to determine result
    if (activityResultDto.finished)
      result = activityResultLogic(
        activityResultDto.activityAnswers,
        activity.avaliationMethod,
      );
    activityResult.result = result;
    activityResult.finished = activityResultDto.finished;
    activityResult.activityAnswers = activityResultDto.activityAnswers;
    return (await activityResult.save()).populate([
      {
        path: 'activity',
        model: 'Activity',
        select: '_id name',
      },
      'user',
    ]);
  }

  async findManyById(arrayOfIds: Array<Types.ObjectId>) {
    const activityResults = await this.activityResultRepository.find({
      _id: { $in: arrayOfIds },
    });

    return { activityResults };
  }
}
