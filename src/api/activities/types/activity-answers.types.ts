import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { Schema, Types } from 'mongoose';
type AnyType = { [x: string]: any };
export interface ActivityAnswersItemType extends AnyType {
  _id: Types.ObjectId;
}
export type ActivityAnswersDocument = ActivityAnswers & Document;
@NestSchema({ timestamps: true })
export class ActivityAnswers {
  @Prop({ type: [Schema.Types.Mixed] })
  activity?: Types.Array<ActivityAnswersItemType>;
}
export const ActivityAnswersSchema =
  SchemaFactory.createForClass(ActivityAnswers);
