import { CacheModule, Module } from '@nestjs/common';
import { ClassroomService } from './services';
import { ClassroomController } from './controllers';
import { ClassroomRepository } from './repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { Classroom, ClassroomSchema } from './entities/classroom.entity';
import { UsersModule } from '../users';

@Module({
  controllers: [ClassroomController],
  providers: [ClassroomService, ClassroomRepository],
  exports: [ClassroomService, ClassroomRepository],
  imports: [
   UsersModule,
    CacheModule.register(),
    MongooseModule.forFeature([
      { name: Classroom.name, schema: ClassroomSchema },
    ]),
  ],
})
export class ClassroomModule {}
