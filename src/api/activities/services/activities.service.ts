import { Injectable } from '@nestjs/common';
import { ActivitiesRepository } from '../repositories';

@Injectable()
export class ActivitiesService {
  constructor(private readonly activitiesRepository: ActivitiesRepository) {}
  async findAll() {
    const activities = await this.activitiesRepository.find();
    return { activities };
  }

  findOne(id: string) {
    return this.activitiesRepository.findOne({ _id: id });
  }
}
