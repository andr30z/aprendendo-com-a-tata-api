import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostDocument, Post } from '../entities';
import { EntityRepository } from 'src/database/entity.repository';
import { Model, Types } from 'mongoose';
import { populateRelations } from 'src/database/populate-relations.util';

@Injectable()
export class PostRepository extends EntityRepository<PostDocument> {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
  ) {
    super(postModel);
  }

  async findByClass(classId: string) {
    return this.postModel
      .find({ classroom: new Types.ObjectId(classId) })
      .populate([
        'author',
        {
          path: 'classroom',
          model: 'Classroom',
          populate: [
            {
              path: 'teacher',
              model: 'User',
            },
            {
              path: 'members',
              model: 'User',
            },
          ],
        },
      ]);

    // .then((x) => {
    //   console.log(x);
    //   return x;
    // });
  }
}
