import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationRepository } from './notification.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.entity';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationRepository],
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  exports: [NotificationsService, NotificationRepository],
})
export class NotificationsModule {}
