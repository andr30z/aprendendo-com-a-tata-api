import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { Document, ObjectId } from 'mongoose';
import { ActivityResult } from 'src/api/activities';
import { Activity } from 'src/api/activities/entities/activity.entity';
import { Classroom } from 'src/api/classroom/entities/classroom.entity';
import { PostTypes } from 'src/api/classroom/types';
import { User } from 'src/api/users';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
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
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: false,
      },
    ],
  })
  @Type(() => Activity)
  activities: Array<mongoose.Types.ObjectId>;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActivityResult',
        required: false,
      },
    ],
  })
  @Type(() => ActivityResult)
  activitiesResult?: Array<mongoose.Types.ObjectId>;

  @Prop({ required: true })
  type: PostTypes;
}

export const PostSchema = SchemaFactory.createForClass(Post);
