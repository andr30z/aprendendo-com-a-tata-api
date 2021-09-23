import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, ActivityDocument } from '../entities/activity.entity';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class ActivitiesRepository extends EntityRepository<ActivityDocument> {
  constructor(
    @InjectModel(Activity.name) private userModel: Model<ActivityDocument>,
  ) {
    super(userModel);
  }
}
