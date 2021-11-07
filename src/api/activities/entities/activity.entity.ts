import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';
import {
  ActivityDificultyTypes,
  ActivityTypes,
  AvaliationMethods,
} from '../types';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true, strict: false })
export class Activity {
  @Transform(({ obj }) => obj._id.toString())
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

  @Prop()
  avaliationMethod: AvaliationMethods;

  @Prop()
  acceptWrongAnswers: boolean;

  @Prop({ required: true })
  tags: Array<String>;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
