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
import { Comment } from 'src/api/classroom/entities/';
import {
  MongoSerializerInterceptor,
  NotFoundInterceptor,
} from 'src/interceptors';
import { CreateCommentDto } from '../dto';
import { CommentService } from '../services';

@UseInterceptors(new NotFoundInterceptor())
@UseInterceptors(MongoSerializerInterceptor(Comment))
@ApiCookieAuth()
@ApiTags('Comments')
@UseGuards(JwtAuthenticationGuard)
@Controller('v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get('post/:id')
  getCommentsByPost(@Param('id') postId: string) {
    return this.commentService.getCommentsByPost(postId);
  }

  @Post()
  create(@Body() createCommenttDto: CreateCommentDto) {
    return this.commentService.create(createCommenttDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.commentService.deleteOne(id);
  }
}
