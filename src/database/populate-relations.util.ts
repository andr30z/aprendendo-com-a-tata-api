import {
  Document,
  EnforceDocument,
  PopulateOptions,
  Query,
  QueryWithHelpers,
} from 'mongoose';

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
  query:
    | (T &
        Document<any, any, any> & {
          _id: any;
        })
    | QueryWithHelpers<
        Array<EnforceDocument<T, any>>,
        EnforceDocument<T, any>,
        T,
        any
      >,
  keysToPopulate: Array<string | PopulateOptions>,
) {
  return query.populate(keysToPopulate);
}
