import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EntityRepository } from 'src/database/entity.repository';
import { Post, PostDocument } from '../entities';

@Injectable()
export class PostRepository extends EntityRepository<PostDocument> {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
  ) {
    super(postModel);
  }

  async findByClass(classId: string) {
    console.log('teste');
    const activityPopulate = {
      path: 'activities',
      model: 'Activity',
      select: '_id name color difficulty',
    };
    return this.postModel
      .find({ classroom: new Types.ObjectId(classId) })
      .select('-classroom')
      .populate([
        activityPopulate,
        {
          path: 'postActivityResult',
          model: 'PostActivityResult',
          populate: [
            'user',
            {
              path: 'activitiesResult',
              model: 'ActivityResult',
              populate: ['user', { ...activityPopulate, path: 'activity' }],
            },
          ],
        },
        'author',
      ]);
  }
}
