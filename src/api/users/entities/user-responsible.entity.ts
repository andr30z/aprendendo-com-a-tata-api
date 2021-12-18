import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';
import {
  DEFAULT_MONGOOSE_SCHEMA_OPTIONS
} from 'src/database';
import { User } from './user.entity';

export type UserResponsibleDocument = UserResponsible & Document;

@Schema(DEFAULT_MONGOOSE_SCHEMA_OPTIONS)
export class UserResponsible {
  @Transform(({ obj }) => obj._id.toString())
  _id: ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Type(() => User)
  responsibleUser: MongooseSchema.Types.ObjectId;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Type(() => User)
  child: MongooseSchema.Types.ObjectId;
}

export const UserResponsibleSchema = SchemaFactory.createForClass(UserResponsible);
