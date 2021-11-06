import {
  Prop,
  Schema as MongooseSchema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { Types, Schema } from 'mongoose';
import { ActivityResult } from 'src/api/activities';

export type PostActivityResultDocument = PostActivityResult & Document;
@MongooseSchema({ timestamps: true })
export class PostActivityResult {
  @Transform(({ obj }) => obj._id.toString())
  _id: Types.ObjectId;

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

  @Prop({ required: true })
  user: Types.ObjectId;
}

export const PostActivityResultSchema =
  SchemaFactory.createForClass(PostActivityResult);
