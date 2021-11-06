import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersService } from 'src/api/users';
import { convertToMongoId, isValidMongoId } from 'src/utils';
import { ActivitiesService } from '.';
import { UpsertActivityResultDto } from '../dto';
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

  async upsertActivityResult(
    userId: string,
    activityResultDto: UpsertActivityResultDto,
  ) {
    const user = await this.userService.getById(userId);
    const activity = await this.activitiesService.findOne(
      activityResultDto.activityId,
    );
    let result: number;
    //logic to determine result
    if (activityResultDto.finished)
      result = activityResultLogic(
        activityResultDto.activityAnswers,
        activity.avaliationMethod,
      );

    return this.activityResultRepository.upsert(
      {
        _id: convertToMongoId(activityResultDto.activityResultId),
        user: user._id,
      },
      { ...activityResultDto, result: result ? result : 0 },
    );
  }

  async findManyById(arrayOfIds: Array<Types.ObjectId>) {
    const activityResults = await this.activityResultRepository.find({
      _id: { $in: arrayOfIds },
    });

    return { activityResults };
  }
}
