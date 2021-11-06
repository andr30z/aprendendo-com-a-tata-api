import { Prop } from '@nestjs/mongoose';
import { Schema, Types } from 'mongoose';
type AnyType = { [x: string]: any };
export interface ActivityAnswersItemType extends AnyType {
  _id: Types.ObjectId;
}
export class ActivityAnswers {
  @Prop({ type: [Schema.Types.Mixed] })
  activityAnswers?: Array<ActivityAnswersItemType>;
}
