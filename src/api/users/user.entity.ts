import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';
import { UserType } from './types/user.type';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Transform(({ obj, value }) => obj._id.toString())
  _id: ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  type: UserType;

  @Exclude({ toPlainOnly: true })
  @Prop({ required: true })
  password: string;

  @Prop()
  age: number;

  @Prop()
  @Exclude({ toPlainOnly: true })
  currentHashedRefreshToken?: string;

  @Prop()
  profilePhoto?: string;

  //  toJSON() {
  //    return classToPlain(this);
  //  }
}

export const UserSchema = SchemaFactory.createForClass(User);
