import { Document, EnforceDocument, PopulateOptions, Query } from 'mongoose';

export function populateClassroom<T extends Document>(
  query: Query<EnforceDocument<T, {}>, EnforceDocument<T, {}>, {}, T>,
) {
  return query.populate('teacher').populate('members').exec();
}

/**
 *
 * @author andr3z0
 **/
export async function populateRelations<T>(
  query: T &
    Document<any, any, any> & {
      _id: any;
    },
  keysToPopulate: Array<string | PopulateOptions>,
) {
  for (let index = 0; index < keysToPopulate.length; index++) {
    const key = keysToPopulate[index];
    await query.populate(key);
  }

  return query;
}
