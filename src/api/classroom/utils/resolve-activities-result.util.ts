import { Types } from 'mongoose';
import { ActivityResult } from 'src/api/activities';
import { convertToMongoId } from 'src/utils';

export function resolveActivityResult(
  newId: Types.ObjectId,
  activityId: string,
  oldArray: Array<ActivityResult>,
) {
  const newArray = oldArray.map((x) => x._id) as any as Types.ObjectId[];
  const itemIndex = oldArray.findIndex((x) =>
    x.activity._id.equals(activityId),
  );
  if (itemIndex === -1) return [...newArray, newId];
  newArray[itemIndex] = newId as any;
  return newArray;
}
