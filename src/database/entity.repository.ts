import {
  AnyKeys,
  AnyObject,
  Document,
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

/**
 * Base Repository for all others repositorys.
 * @author andr3z0
 **/
export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  /**
   * Same as findOne, but without the exec() at the end.
   * @author andr3z0
   **/
  findOneWithPromise(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ) {
    return this.entityModel.findOne(entityFilterQuery, projection);
  }

  /**
   * Find one operation
   * @author andr3z0
   **/
  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
    populatePath?: string,
  ) {
    const query = this.entityModel.findOne(entityFilterQuery, projection);
    if (populatePath) return query.populate(populatePath).exec();
    return query.exec();
  }

  /**
   * Find
   * @author andr3z0
   **/
  async find(entityFilterQuery?: FilterQuery<T>) {
    return this.entityModel.find(entityFilterQuery);
  }

  /**
   * Update one entity, this won't return the entity document
   * @author andr3z0
   **/
  async updateOne(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
    queryOptions?: QueryOptions,
  ) {
    return this.entityModel.updateOne(
      entityFilterQuery,
      updateEntityData,
      queryOptions,
    );
  }

  /**
   * Create a document in one ```T``` collection
   * @author andr3z0
   **/
  async create(createEntityData: AnyKeys<T>) {
    const entity = new this.entityModel(createEntityData);
    const savedData = entity.save();

    return savedData;
  }

  /**
   * Update entity
   * @author andr3z0
   **/
  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
    queryOptions?: QueryOptions,
  ) {
    return this.entityModel.findOneAndUpdate(
      entityFilterQuery,
      updateEntityData,
      { new: true, ...queryOptions },
    );
  }

  /**
   * Delete many entities method
   * @author andr3z0
   **/
  async deleteMany(entityFilterQuery: FilterQuery<T>) {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }

  /**
   * Delete one method
   * @author andr3z0
   **/
  async deleteOne(entityFilterQuery: FilterQuery<T>) {
    return this.entityModel.deleteOne(entityFilterQuery);
  }

  /**
   * Same as ```deleteOne```, but return the deleted document.
   * @author andr3z0
   **/
  async deleteAndReturnDocument(entityFilterQuery: FilterQuery<T>) {
    return this.entityModel.findOneAndDelete(entityFilterQuery);
  }
}
