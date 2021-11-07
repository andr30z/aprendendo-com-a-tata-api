import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId, Schema, Types } from 'mongoose';
import { DEFAULT_MONGOOSE_SCHEMA_OPTIONS } from 'src/database';
export type ActivityAnswersDocument = ActivityAnswers & Document;
@NestSchema(DEFAULT_MONGOOSE_SCHEMA_OPTIONS)
export class ActivityAnswers {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: [Schema.Types.Mixed] })
  activity?: Types.Array<Record<string, any>>;
}
export const ActivityAnswersSchema =
  SchemaFactory.createForClass(ActivityAnswers);
