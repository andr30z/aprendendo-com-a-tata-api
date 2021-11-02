import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users';
import { ClassroomController, PostController } from './controllers';
import { Classroom, ClassroomSchema, Post, PostSchema } from './entities';
import { ClassroomRepository, PostRepository } from './repositories';
import { ClassroomService, PostService } from './services';

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
