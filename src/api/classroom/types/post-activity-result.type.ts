import {
  Prop,
  Schema as MongooseSchema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { Types, Schema, ObjectId, Document } from 'mongoose';
import { User } from 'src/api/users';
import { ActivityResult } from 'src/api/activities';
import { DEFAULT_MONGOOSE_SCHEMA_OPTIONS } from 'src/database';

export type PostActivityResultDocument = PostActivityResult & Document;
@MongooseSchema(DEFAULT_MONGOOSE_SCHEMA_OPTIONS)
export class PostActivityResult {
  @Transform(({ obj }) => obj._id.toString())
  _id: ObjectId;

  @Prop({
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ActivityResult',
        required: false,
      },
    ],
  })
  @Type(() => ActivityResult)
  activitiesResult: Array<Types.ObjectId>;

  @Prop({
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Type(() => User)
  user: Types.ObjectId;
}

export const PostActivityResultSchema =
  SchemaFactory.createForClass(PostActivityResult);
