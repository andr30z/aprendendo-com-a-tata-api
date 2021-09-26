import { Injectable } from '@nestjs/common';
import { ActivitiesRepository } from '../repositories';

@Injectable()
export class ActivitiesService {
  constructor(private readonly activitiesRepository: ActivitiesRepository) {}
  findAll() {
    return this.activitiesRepository.find();
  }

  findOne(id: string) {
    return this.activitiesRepository.findOne({ _id: id });
  }
}
