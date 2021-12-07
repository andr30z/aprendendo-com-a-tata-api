import { Injectable } from '@nestjs/common';
import { isValidMongoId } from 'src/utils';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationRepository,
  ) {}
  create(createNotificationDto: CreateNotificationDto) {
    isValidMongoId(createNotificationDto.userId);
    return this.notificationsRepository.create(createNotificationDto);
  }

  findAllNotificationByUserId(userId: string) {
    isValidMongoId(userId);
    return this.notificationsRepository.find({ user: userId });
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
