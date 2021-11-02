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
import { Classroom } from 'src/api/classroom/entities';
import {
  MongoSerializerInterceptor,
  NotFoundInterceptor,
} from 'src/interceptors';
import { CreateClassroomDto } from '../dto/create-classroom.dto';
import { ClassroomService } from '../services';

@UseInterceptors(new NotFoundInterceptor())
@UseInterceptors(MongoSerializerInterceptor(Classroom))
@ApiCookieAuth()
@ApiTags('Classroom')
@UseGuards(JwtAuthenticationGuard)
@Controller('v1/classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll() {
    return this.classroomService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() createUserDto: CreateClassroomDto) {
    return this.classroomService.update(id, createUserDto);
  }

  @Post()
  async create(@Body() createUserDto: CreateClassroomDto) {
    return await this.classroomService.create(createUserDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.classroomService.deleteOne(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classroomService.findOne(id);
  }
}
