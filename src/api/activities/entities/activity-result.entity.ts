import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { Document, ObjectId, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from 'src/api/users';
import { ActivityAnswers, ActivityAnswersSchema } from '../types';
import { Activity } from './activity.entity';

export type ActivityResultDocument = ActivityResult & Document;

@Schema({ timestamps: true })
export class ActivityResult {
  @Transform(({ obj }) => obj._id.toString())
  _id: ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Type(() => User)
  user: Types.ObjectId;

  @Prop({ required: true })
  finished: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Activity',
    required: true,
  })
  @Type(() => Activity)
  activity: Types.ObjectId;

  @Prop({ required: false })
  result: number;

  @Prop({ required: true, type: [ActivityAnswersSchema] })
  activityAnswers: Types.Array<ActivityAnswers>;
}

export const ActivityResultSchema =
  SchemaFactory.createForClass(ActivityResult);
