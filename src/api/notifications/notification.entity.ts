import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { classToPlain, Transform, Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { Document, ObjectId } from 'mongoose';
import { User } from 'src/api/users';
import {
  getDefaultSchemaOption
} from 'src/database/utils';
import { NotificationTypes } from './types';

export type NotificationDocument = Notification & Document;

@Schema({
  ...getDefaultSchemaOption({
    toJSON: {
      transform: (_doc, ret) => {
        const payload = {
          ...ret?.payload,
        };
        if (payload?.responsibleId && payload?.childId) {
          payload.responsibleId = payload.responsibleId.toString();
          payload.childId = payload.childId.toString();
        }
        return classToPlain({ ...ret, payload, _id: ret._id.toString() });
      },
    },
  }),
})
export class Notification {
  @Transform(({ obj }) => obj._id.toString())
  _id: ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  checked: boolean;
  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  payload: any;

  @Prop({ required: true })
  type: NotificationTypes;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Type(() => User)
  user: mongoose.Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
