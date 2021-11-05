import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { isValidMongoId } from 'src/utils';
import { ActivitiesRepository } from '../repositories';

@Injectable()
export class ActivitiesService {
  constructor(private readonly activitiesRepository: ActivitiesRepository) { }
  async findAll() {
    const activities = await this.activitiesRepository.find();
    return { activities };
  }

  findOne(id: string) {
    isValidMongoId(id);
    return this.activitiesRepository.findOneOrThrow({ _id: id }, () => new NotFoundException('Atividade não encontrada'));
  }


  async findManyById(arrayOfIds: Array<Types.ObjectId>) {
    const activities = await this.activitiesRepository.find({
      '_id': { $in: arrayOfIds }
    })

    return { activities }
  }
}
