import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostDocument, Post, } from '../entities';
import { EntityRepository } from 'src/database/entity.repository';
import { Model } from 'mongoose';

@Injectable()
export class PostRepository extends EntityRepository<PostDocument> {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
  ) {
    super(postModel);
  }
}
