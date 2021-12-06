import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseBoolPipe,
  Post as PostMethod,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostActivityResult } from 'src/api/classroom/types';
import JwtAuthenticationGuard from 'src/api/authentication/jwt-authentication.guard';
import { Classroom, Post } from 'src/api/classroom/entities';
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
  constructor(private readonly classroomService: ClassroomService) { }

  @UseInterceptors(CacheInterceptor)
  @ApiQuery({
    name: 'code',
    type: String,
    description: 'Classroom code. Optional.',
    required: false,
  })
  @UseInterceptors(MongoSerializerInterceptor(Classroom))
  @Get()
  findAll(@Query('code') code?: string) {
    return this.classroomService.findAll(code);
  }

  @UseInterceptors(
    MongoSerializerInterceptor(Post),
    MongoSerializerInterceptor(PostActivityResult),
  )
  @Get(':id/posts')
  findPostsByClassroom(@Param('id') classId: string) {
    return this.classroomService.getPostsByClass(classId);
  }

  @Roles(UserType.T)
  @Delete(':idClass/users/:idUser')
  removeUser(
    @Param('idClass') classroomId: string,
    @Param('idUser') userToRemoveId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.classroomService.removeUserFromClassroom(
      classroomId,
      userToRemoveId,
      currentUser,
    );
  }

  @Roles(UserType.C)
  @Delete(':idClass/users')
  leaveClassroom(
    @Param('idClass') classroomId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.classroomService.leaveClassroom(
      classroomId,
      currentUser._id.toString(),
    );
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
  @Roles(UserType.T)
  @Put(':id')
  @UseInterceptors(MongoSerializerInterceptor(Classroom))
  update(@Param('id') id: string, @Body() createUserDto: CreateClassroomDto) {
    return this.classroomService.update(id, createUserDto);
  }

  @Roles(UserType.T)
  @PostMethod()
  @UseInterceptors(MongoSerializerInterceptor(Classroom))
  async create(@Body() createUserDto: CreateClassroomDto) {
    return await this.classroomService.create(createUserDto);
  }

  @Delete(':id')
  @Roles(UserType.T)
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
  @PostMethod(':classId/join-request')
  joinClassroomRequest(
    @Param('classId') classId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.classroomService.classroomInviteRequest(classId, currentUser);
  }

  @Roles(UserType.T)
  @PostMethod(':classId/join-request/:userId')
  joinClassroomRequestApprove(
    @Param('classId') classId: string,
    @Param('userId') userId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.classroomService.acceptOrDenyUserJoinRequest(
      classId,
      userId,
      currentUser,
    );
  }

  @Roles(UserType.T)
  @Delete(':classId/join-request/:userId')
  joinClassroomRequestDeny(
    @Param('classId') classId: string,
    @Param('userId') userId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.classroomService.acceptOrDenyUserJoinRequest(
      classId,
      userId,
      currentUser,
      true,
    );
  }
}
