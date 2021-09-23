import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';
import { ActivityDificultyTypes, ActivityTypes } from '../types';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  activityImage: string;

  @Prop({ required: true })
  activityUtterance: string;

  @Prop({ required: true })
  type: ActivityTypes;

  @Prop({ required: true })
  dificulty: ActivityDificultyTypes;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  stages: any;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
