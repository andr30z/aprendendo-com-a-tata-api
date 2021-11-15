import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post as PostMethod,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/api/users';
import JwtAuthenticationGuard from 'src/api/authentication/jwt-authentication.guard';
import { Post } from 'src/api/classroom/entities/';
import {
  MongoSerializerInterceptor,
  NotFoundInterceptor,
} from 'src/interceptors';
import { CreatePostDto, StartActivityDto, UpdatePostDto } from '../dto';
import { PostService } from '../services';
import { ActivityResult } from 'src/api/activities';
import { PostActivityResult } from 'src/api/classroom/types';

@UseInterceptors(new NotFoundInterceptor())
@ApiCookieAuth()
@ApiTags('Post')
@UseInterceptors(MongoSerializerInterceptor(Post))
@UseGuards(JwtAuthenticationGuard)
@Controller('v1/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @PostMethod()
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postService.create(createPostDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.postService.deleteOne(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id, true);
  }

  @PostMethod(':id/start-activity')
  @UseInterceptors(
    MongoSerializerInterceptor(ActivityResult),
  )
  startActivity(
    @Param('id') userId: string,
    @Body() startActivityDto: StartActivityDto,
  ) {
    return this.postService.startActivity(userId, startActivityDto);
  }

  @UseInterceptors(
    MongoSerializerInterceptor(ActivityResult),
    MongoSerializerInterceptor(PostActivityResult),
  )
  @Get(':idPost/users/:userId')
  getActivitiesResultsByPost(
    @Param('idPost') postId: string,
    @Param('userId') userId: string,
  ) {
    return this.postService.getUserActivityResultsFromUserByPost(
      postId,
      userId,
    );
  }
}
