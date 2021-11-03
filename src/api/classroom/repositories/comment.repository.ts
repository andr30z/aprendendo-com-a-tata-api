import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from 'src/database/entity.repository';
import { Comment, CommentDocument } from '../entities';

@Injectable()
export class CommentRepository extends EntityRepository<CommentDocument> {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
  ) {
    super(commentModel);
  }
}
