import { Types } from "mongoose";
type AnyType = { [x: string]: any }
export interface ActivityAnswersItemType extends AnyType {
    _id: Types.ObjectId;
}
export interface ActivityAnswersType {
    activityAnswers?: Array<ActivityAnswersItemType>;
}