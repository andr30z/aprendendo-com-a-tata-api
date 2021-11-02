import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClassroomDocument, Classroom } from '../entities/classroom.entity';
import { EntityRepository } from 'src/database/entity.repository';
import * as mongoose from 'mongoose';

@Injectable()
export class ClassroomRepository extends EntityRepository<ClassroomDocument> {
  constructor(
    @InjectModel(Classroom.name)
    private classroomModel: mongoose.Model<ClassroomDocument>,
  ) {
    super(classroomModel);
  }

  findClassByNameAndUser(name: string, teacherId: mongoose.Types.ObjectId) {
    return this.classroomModel.findOne({
      teacher: teacherId,
      name,
    });
  }
}
