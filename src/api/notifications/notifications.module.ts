import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationRepository } from './notification.repository';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationRepository]
})
export class NotificationsModule {}
