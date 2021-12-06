import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { Document, ObjectId } from 'mongoose';
import { User } from 'src/api/users';
import { getDefaultSchemaOption } from 'src/database';
import { formatFileUploadResponse } from 'src/utils';

export type ClassroomDocument = Classroom & Document;

@Schema(getDefaultSchemaOption({
  toJSON: {
    transform(_, ret) {
      return {
        ...ret,
        _id: ret._id.toString(),
        classPhoto: ret.classPhoto ? formatFileUploadResponse(ret.classPhoto) : undefined
      }
    }
  }
}))
export class Classroom {
  @Transform(({ obj }) => obj._id.toString())
  _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Type(() => User)
  teacher: mongoose.Types.ObjectId;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  @Type(() => User)
  members: Array<mongoose.Types.ObjectId>;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  @Type(() => User)
  pendingJoinRequests: Array<mongoose.Types.ObjectId>;

  @Prop({ required: true })
  classPhoto: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  textColor: string;

  @Prop({ required: true })
  code: string;
  @Prop({ required: true })
  tags: Array<string>;
}

export const ClassroomSchema = SchemaFactory.createForClass(Classroom);
