import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/api/authentication/jwt-authentication.guard';
import { Classroom, Post as PostClass } from 'src/api/classroom/entities';
import { CurrentUser } from 'src/api/decorators';
import { Roles, UserTypeGuard } from 'src/api/guards';
import { UserType, User } from 'src/api/users';
import {
  MongoSerializerInterceptor,
  NotFoundInterceptor,
} from 'src/interceptors';
import { CreateClassroomDto } from '../dto/create-classroom.dto';
import { ClassroomService } from '../services';
@UseInterceptors(new NotFoundInterceptor())
@ApiCookieAuth()
@ApiTags('Classroom')
@UseGuards(JwtAuthenticationGuard, UserTypeGuard)
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
  @Get(':id/posts')
  findPostsByClassroom(@Param('id') classId: string) {
    return this.classroomService.getPostsByClass(classId);
  }

  @UseInterceptors(MongoSerializerInterceptor(Classroom))
  @Get('users/:id')
  findClassesByUser(
    @Param('id') userId: string,
    @Query(
      'isTeacher',
      new ParseBoolPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    isTeacher: boolean,
  ) {
    return this.classroomService.classesByUsers(userId, isTeacher);
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

  @Roles(UserType.C)
  @Post(':classId/join-request')
  joinClassroomRequest(
    @Param('classId') classId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.classroomService.classroomInviteRequest(classId, currentUser);
  }

  @Roles(UserType.T)
  @Post(':classId/join-request/:userId')
  joinClassroomRequestApprove(
    @Param('classId') classId: string,
    @Param('userId') userId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.classroomService.acceptUserJoinRequest(
      classId,
      userId,
      currentUser,
    );
  }
}
