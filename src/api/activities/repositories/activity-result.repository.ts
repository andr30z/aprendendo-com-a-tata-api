import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from 'src/database/entity.repository';
import {
  ActivityResult,
  ActivityResultDocument
} from '../entities/';

@Injectable()
export class ActivityResultRepository extends EntityRepository<ActivityResultDocument> {
  constructor(
    @InjectModel(ActivityResult.name)
    private activityResultModel: Model<ActivityResultDocument>,
  ) {
    super(activityResultModel);
  }


}
