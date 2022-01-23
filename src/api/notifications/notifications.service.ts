import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { isValidMongoId } from 'src/utils';
import { NotificationDocument } from '.';
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
    return this.notificationsRepository.create({
      ...createNotificationDto,
      user: createNotificationDto.userId,
    });
  }

  async findAllNotificationByUserId(userId: string) {
    isValidMongoId(userId);
    return {
      notifications: await this.notificationsRepository
        .find({ user: userId })
        .populate(['user']),
    };
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOneByFilter(entityFilterQuery: FilterQuery<NotificationDocument>) {
    return this.notificationsRepository.findOne(entityFilterQuery);
  }

  findOne(notificationId: string) {
    isValidMongoId(notificationId);
    return this.notificationsRepository.findOneOrThrow(
      { _id: notificationId },
      () => new NotFoundException('Notificação não encontrada!'),
    );
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  async remove(id: string) {
    const deleted = await this.notificationsRepository.deleteAndReturnDocument({
      _id: id,
    });

    if (!deleted)
      throw new NotFoundException(
        'Não foi possivel encontrar uma notificação com o ID informado!',
      );
    return deleted.populate('user');
  }
}
