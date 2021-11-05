import { Types } from 'mongoose';

/**
 * Convert string to mongoID
 * @author andr3z0
 **/
export function convertToMongoId(id: string) {
  return new Types.ObjectId(id);
}
