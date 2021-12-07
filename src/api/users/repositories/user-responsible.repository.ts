import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserResponsibleDocument, UserResponsible } from '../entities';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class UserResponsibleRepository extends EntityRepository<UserResponsibleDocument> {
  constructor(@InjectModel(UserResponsible.name) private userResponsibleModel: Model<UserResponsibleDocument>) {
    super(userResponsibleModel);
  }

 
}
