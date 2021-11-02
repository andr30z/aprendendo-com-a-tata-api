import { CacheModule, Module } from '@nestjs/common';
import { ClassroomService, PostService } from './services';
import { ClassroomController, PostController } from './controllers';
import { ClassroomRepository, PostRepository } from './repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { Classroom, ClassroomSchema, Post, PostSchema } from './entities';
import { UsersModule } from '../users';

@Module({
  controllers: [ClassroomController, PostController],
  providers: [
    PostRepository,
    PostService,
    ClassroomService,
    ClassroomRepository,
  ],
  exports: [ClassroomService, ClassroomRepository, PostService, PostRepository],
  imports: [
    UsersModule,
    CacheModule.register(),
    MongooseModule.forFeature([
      { name: Classroom.name, schema: ClassroomSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
})
export class ClassroomModule {}
