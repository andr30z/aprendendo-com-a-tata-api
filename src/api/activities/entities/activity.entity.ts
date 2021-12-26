import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { classToPlain, Transform } from 'class-transformer';
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';
import { DEFAULT_MONGOOSE_SCHEMA_OPTIONS } from 'src/database';
import {
  ActivityDifficultyTypes,
  ActivityTypes,
  AvaliationMethods,
} from '../types';

export type ActivityDocument = Activity & Document;
// thank you stackoverflow user
// i should change this to an utils folder...
function iter(o: any) {
  Object.keys(o).forEach(function (k) {
    if (k === '_id') {
      o[k] = o[k].toString();
      return;
    }
    if (o[k] !== null && typeof o[k] === 'object') return iter(o[k]);
    if (Array.isArray(o[k])) return o[k].map(iter);
  });
}

@Schema({
  ...DEFAULT_MONGOOSE_SCHEMA_OPTIONS,
  toJSON: {
    transform: (_, ret) => {
      let returnObj = { ...ret, _id: ret._id.toString() };
      //this is a popular case of the famous ""JEITINHO BRASILEIRO"
      iter(returnObj);
      return classToPlain(returnObj);
    },
  },
  strict: false,
})
export class Activity {
  @Transform(({ obj }) => obj._id.toString())
  _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  activityImage: string;

  @Prop({ required: true })
  activityUtterance: string;

  @Prop({ required: true })
  type: ActivityTypes;

  @Prop({ required: true })
  difficulty: ActivityDifficultyTypes;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  stages: Array<any>;

  @Prop()
  avaliationMethod: AvaliationMethods;

  @Prop()
  acceptWrongAnswers: boolean;

  @Prop({ required: true })
  tags: Array<String>;

  @Prop({ required: false })
  story?: any;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
