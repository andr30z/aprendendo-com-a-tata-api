import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/api/authentication/jwt-authentication.guard';
import { Post as PostClass } from 'src/api/classroom/entities/';
import {
  MongoSerializerInterceptor,
  NotFoundInterceptor,
} from 'src/interceptors';
import { CreatePostDto, StartActivityDto, UpdatePostDto } from '../dto';
import { PostService } from '../services';

@UseInterceptors(new NotFoundInterceptor())
@UseInterceptors(MongoSerializerInterceptor(PostClass))
@ApiCookieAuth()
@ApiTags('Post')
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

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postService.create(createPostDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.postService.deleteOne(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Post(':id/start-activity')
  startActivity(
    @Param('id') userId: string,
    @Body() startActivityDto: StartActivityDto,
  ) {
    return this.postService.startActivity(userId, startActivityDto);
  }

  @Get(':id/user/:userId')
  getActivitiesResultsByPost(
    @Param('id') postId: string,
    @Param('userId') userId: string,
  ) {
    return this.postService.getUserActivityResultsFromUserByPost(
      postId,
      userId,
    );
  }
}
