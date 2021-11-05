import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { Document, ObjectId, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from 'src/api/users';
import { ActivityDificultyTypes, ActivityTypes, AvaliationMethods } from '../types';
import { ActivityAnswersType } from '../types/activity-answers.types';
import { Activity } from './activity.entity';

export type ActivityResultDocument = ActivityResult & Document;

@Schema({ timestamps: true, strict: false })
export class ActivityResult {
    @Transform(({ obj }) => obj._id.toString())
    _id: ObjectId;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        required: true,
    })
    @Type(() => User)
    user: Types.ObjectId;

    @Prop({ required: true })
    activityUtterance: string;

    @Prop({ required: true })
    acceptWrongAnswers: boolean;

    @Prop({ required: true })
    finished: boolean;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Activity',
        required: true,
    })
    @Type(() => Activity)
    activityResult: Activity;

    @Prop({ required: true })
    result: number;

    @Prop({ required: true })
    activityAnswers: ActivityAnswersType;
}

export const ActivityResultSchema = SchemaFactory.createForClass(ActivityResult);
