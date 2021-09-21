import {
  AnyKeys,
  AnyObject,
  Document,
  FilterQuery,
  Model,
  UpdateQuery,
} from 'mongoose';

/**
 * Base Repository for all others repositorys.
 * @author andr3z0
 **/
export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}
  /**
   * Find one operation
   * @author andr3z0
   **/
  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ) {
    return this.entityModel.findOne(entityFilterQuery, projection).exec();
  }

  /**
   * Find
   * @author andr3z0
   **/
  async find(entityFilterQuery?: FilterQuery<T>) {
    return this.entityModel.find(entityFilterQuery);
  }

  /**
   * Create a document in one ```T``` collection
   * @author andr3z0
   **/
  async create(createEntityData: AnyKeys<T>) {
    const entity = new this.entityModel(createEntityData);
    return entity.save();
  }

  /**
   * Update entity
   * @author andr3z0
   **/
  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
  ) {
    return this.entityModel.findOneAndUpdate(
      entityFilterQuery,
      updateEntityData,
      { new: true },
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
  async deleteOne(entityFilterQuery:FilterQuery<T>){
      return this.entityModel.deleteOne(entityFilterQuery);
  }
}
