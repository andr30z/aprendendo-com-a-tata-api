import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthenticationGuard)
@ApiCookieAuth()
@ApiTags('Notifications')
@Controller('v1/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get('users/:userId')
  findNotificationsByUsers(@Param('userId') userId: string) {
    return this.notificationsService.findAllNotificationByUserId(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
