import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { Document, ObjectId } from 'mongoose';
import { PostTypes } from 'src/api/classroom/types';
import { Classroom } from 'src/api/classroom/entities/classroom.entity';
import { User } from 'src/api/users';
import { PostActivityResult, PostActivityResultSchema } from '../types';
import { Activity } from 'src/api/activities';
import { DEFAULT_MONGOOSE_SCHEMA_OPTIONS } from 'src/database';
export type PostDocument = Post & Document;

@Schema(DEFAULT_MONGOOSE_SCHEMA_OPTIONS)
export class Post {
  @Transform(({ obj }) => obj._id.toString())
  _id: ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Type(() => User)
  author: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true,
  })
  @Type(() => Classroom)
  classroom: mongoose.Types.ObjectId;

  @Prop({ required: true })
  allowComments: boolean;

  @Prop({
    required: false,
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: false,
      },
    ],
  })
  @Type(() => Activity)
  activities?: Array<mongoose.Types.ObjectId>;

  @Prop({
    required: false,
    type: [PostActivityResultSchema],
  })
  postActivityResult?: mongoose.Types.Array<PostActivityResult>;

  @Prop({ required: true })
  type: PostTypes;
}

export const PostSchema = SchemaFactory.createForClass(Post);
