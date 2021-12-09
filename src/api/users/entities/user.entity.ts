import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { classToPlain, Exclude, Transform } from 'class-transformer';
import { Console } from 'console';
import { Document, ObjectId } from 'mongoose';
import { getDefaultSchemaOption } from 'src/database';
import { formatFileUploadResponse } from 'src/utils';
import { UserType } from '../types/user.type';

export type UserDocument = User & Document;

@Schema(
  getDefaultSchemaOption({
    toJSON: {
      transform: (_, ret) => {
        delete ret.currentHashedRefreshToken;
        delete ret.password;
        return classToPlain({
          ...ret,
          _id: ret._id.toString(),
          profilePhoto: ret.profilePhoto
            ? formatFileUploadResponse(ret.profilePhoto)
            : undefined,
        });
      },
    },
  }),
)
export class User {
  @Prop({ required: true })
  name: string;

  @Transform(({ obj }) => obj._id.toString())
  _id: ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  type: UserType;

  @Exclude({ toPlainOnly: true })
  @Prop({ required: true })
  password: string;

  @Prop()
  birthday: Date;

  @Prop({ required: true })
  code: string;

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
