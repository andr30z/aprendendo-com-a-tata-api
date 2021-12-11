import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../../authentication/jwt-authentication.guard';
import { UserResponsibleService } from '../services';

@UseGuards(JwtAuthenticationGuard)
@ApiCookieAuth()
@ApiTags('User-Responsible')
@Controller('v1/user-responsible')
export class UsersResponsibleController {
  constructor(
    private readonly usersResponsibleService: UserResponsibleService,
  ) {}

  @Get(':responsibleUserId')
  getUserChildren(@Param('responsibleUserId') responsibleUserId: string) {
    return this.usersResponsibleService.getUserResponsibleChildrenByUserResponsibleId(responsibleUserId);
  }
  @Post(':responsibleUserId/:childUserId')
  createUserResponsible(
    @Param('responsibleUserId') responsibleUserId: string,
    @Param('childUserId') childUserId: string,
  ) {
    return this.usersResponsibleService.createUsersBond(
      responsibleUserId,
      childUserId,
    );
  }

  @Post('request/:responsibleId/:childCode')
  sendBondRequest(
    @Param('responsibleId') responsibleUserId: string,
    @Param('childCode') childCode: string,
  ) {
    return this.usersResponsibleService.sendUsersBondRequest(
      responsibleUserId,
      childCode,
    );
  }

  @Delete('request/:notificationId')
  denyBondRequest(@Param('notificationId') notificationId: string) {
    return this.usersResponsibleService.denyResponsibleRequest(notificationId);
  }

  @Delete(':id')
  deleteBond(@Param('id') id: string) {
    return this.usersResponsibleService.removeUsersBond(id);
  }
}
