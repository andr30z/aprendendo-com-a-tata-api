import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../entities/user.entity';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class UsersRepository extends EntityRepository<UserDocument> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }

  /**
  * Find an user by his email address.
  * @author andr3z0
  **/
  findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
