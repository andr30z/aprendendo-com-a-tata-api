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
import { Classroom, Post as PostClass } from 'src/api/classroom/entities';
import {
  MongoSerializerInterceptor,
  NotFoundInterceptor,
} from 'src/interceptors';
import { CreateClassroomDto } from '../dto/create-classroom.dto';
import { ClassroomService } from '../services';
@UseInterceptors(new NotFoundInterceptor())
@ApiCookieAuth()
@ApiTags('Classroom')
@UseGuards(JwtAuthenticationGuard)
@Controller('v1/classrooms')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @UseInterceptors(CacheInterceptor)
  @UseInterceptors(MongoSerializerInterceptor(Classroom))
  @Get()
  findAll() {
    return this.classroomService.findAll();
  }

  @UseInterceptors(MongoSerializerInterceptor(PostClass))
  @UseInterceptors(MongoSerializerInterceptor(Classroom))
  @Get(':id/posts')
  findPostsByClassroom(@Param('id') classId: string) {
    return this.classroomService.getPostsByClass(classId);
  }

  @Put(':id')
  @UseInterceptors(MongoSerializerInterceptor(Classroom))
  update(@Param('id') id: string, @Body() createUserDto: CreateClassroomDto) {
    return this.classroomService.update(id, createUserDto);
  }

  @Post()
  @UseInterceptors(MongoSerializerInterceptor(Classroom))
  async create(@Body() createUserDto: CreateClassroomDto) {
    return await this.classroomService.create(createUserDto);
  }

  @Delete(':id')
  @UseInterceptors(MongoSerializerInterceptor(Classroom))
  deleteOne(@Param('id') id: string) {
    return this.classroomService.deleteOne(id);
  }

  @Get(':id')
  @UseInterceptors(MongoSerializerInterceptor(Classroom))
  findOne(@Param('id') id: string) {
    return this.classroomService.findOne(id);
  }
}
