import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { Document, ObjectId } from 'mongoose';
import { User } from 'src/api/users';

export type ClassroomDocument = Classroom & Document;

@Schema({ timestamps: true })
export class Classroom {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Type(() => User)
  teacher: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  @Type(() => User)
  members: Array<mongoose.Schema.Types.ObjectId>;

  @Prop({ required: true })
  classPhoto: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  color: string;
  @Prop({ required: true })
  code: string;
  @Prop({ required: true })
  tags: Array<string>;
}

export const ClassroomSchema = SchemaFactory.createForClass(Classroom);
