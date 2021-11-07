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
import JwtAuthenticationGuard from 'src/api/authentication/jwt-authentication.guard';
import { Post } from 'src/api/classroom/entities/';
import {
  MongoSerializerInterceptor,
  NotFoundInterceptor,
} from 'src/interceptors';
import { CreatePostDto, StartActivityDto, UpdatePostDto } from '../dto';
import { PostService } from '../services';

@UseInterceptors(new NotFoundInterceptor())
@ApiCookieAuth()
@ApiTags('Post')
@UseGuards(JwtAuthenticationGuard)
@Controller('v1/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseInterceptors(CacheInterceptor)
  @UseInterceptors(MongoSerializerInterceptor(Post))
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
  startActivity(
    @Param('id') userId: string,
    @Body() startActivityDto: StartActivityDto,
  ) {
    return this.postService.startActivity(userId, startActivityDto);
  }

  @Get(':idPost/user/:userId')
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
