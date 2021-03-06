import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostActivityResultSchema, PostActivityResult } from './types';
import { ActivitiesModule } from '../activities/activities.module';
import { UsersModule } from '../users';
import {
  ClassroomController,
  PostController,
  CommentController,
} from './controllers';
import {
  Classroom,
  ClassroomSchema,
  Post,
  PostSchema,
  CommentSchema,
  Comment,
} from './entities';
import {
  ClassroomRepository,
  PostRepository,
  CommentRepository,
} from './repositories';
import { ClassroomService, PostService, CommentService } from './services';
import { FilesModule } from '../files';

@Module({
  controllers: [ClassroomController, PostController, CommentController],
  providers: [
    PostRepository,
    PostService,
    ClassroomService,
    ClassroomRepository,
    CommentRepository,
    CommentService,
  ],
  exports: [
    ClassroomService,
    ClassroomRepository,
    PostService,
    PostRepository,
    CommentRepository,
    CommentService,
  ],
  imports: [
    UsersModule,
    ActivitiesModule,
    FilesModule,
    CacheModule.register(),
    MongooseModule.forFeature([
      { name: Classroom.name, schema: ClassroomSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
})
export class ClassroomModule {}
