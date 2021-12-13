import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationsService } from 'src/api/notifications';
import { NotificationTypes } from 'src/api/notifications/types';
import { convertToMongoId, isFromClass, isValidMongoId } from 'src/utils';
import { User } from 'src/api/users';
import { UserResponsibleRepository } from '../repositories';
import { UsersService } from './users.service';
import { UserRequestPayloadStatus } from '../types';

@Injectable()
export class UserResponsibleService {
  constructor(
    private readonly usersResponsibleRepository: UserResponsibleRepository,
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
  ) {}

  findOne(userResponsibleId: string) {
    isValidMongoId(userResponsibleId);
    return this.usersResponsibleRepository.findOneOrThrow(
      { _id: userResponsibleId },
      () => new NotFoundException('Vínculo não existe!'),
    );
  }

  async getUserResponsibleChildrenByUserResponsibleId(userId: string) {
    isValidMongoId(userId);
    return {
      children: await this.usersResponsibleRepository
        .find({
          responsibleUser: userId as any,
        })
        .populate(['responsibleUser', 'child']),
    };
  }

  async getByChildId(childId: string) {
    isValidMongoId(childId);
    return this.usersResponsibleRepository
      .findOneOrThrow(
        { child: convertToMongoId(childId) as any },
        () => new NotFoundException('A Criança não possui um responsável!'),
      )
      .then((resp) => resp.populate(['responsibleUser', 'child']));
  }

  async validateUsersBond(
    childIdentifier: string,
    responsibleId: string,
    isChildCode = false,
  ) {
    const child = await (isChildCode
      ? this.userService.getByCode(childIdentifier)
      : this.userService.getById(childIdentifier));
    const responsible = await this.userService.getById(responsibleId);

    if (
      !this.userService.userIsResponsible(responsible) &&
      !this.userService.userIsTeacher(responsible)
    )
      throw new BadRequestException(
        'O usuário responsável deve ser to tipo T ou R',
      );
    if (!this.userService.userIsChildren(child))
      throw new BadRequestException('O usuário criança deve ser to tipo C');

    return {
      responsible,
      child,
    };
  }

  async validateIfChildHasBond(childId: string) {
    const responsibleDocument = await this.usersResponsibleRepository.findOne({
      child: childId as any,
    });
    if (responsibleDocument)
      throw new ConflictException('A criança já possui vínculo!');

    return responsibleDocument;
  }

  async createUsersBond(userResponsibleId: string, userChildId: string) {
    isValidMongoId(userResponsibleId);
    isValidMongoId(userChildId);

    this.validateIfChildHasBond(userChildId);
    this.validateUsersBond(userChildId, userResponsibleId);

    const notification = await this.notificationService.findOneByFilter({
      user: userChildId,
      payload: {
        responsibleId: convertToMongoId(userResponsibleId),
        childId: convertToMongoId(userChildId),
        status: UserRequestPayloadStatus.SENDED,
      },
    });
    console.log(notification);
    if (!notification)
      throw new BadRequestException(
        'Para criar o vínculo, uma notificação de pedido de vinculação entre os usuários deve existir!',
      );
    notification.payload = {
      ...notification.payload,
      status: UserRequestPayloadStatus.ACCEPTED,
    };
    const userReponsibleDoc = await this.usersResponsibleRepository.create({
      child: userChildId,
      responsibleUser: userResponsibleId,
    });
    await notification.save();
    return userReponsibleDoc;
  }

  async removeUsersBond(userResponsibleId: string) {
    const deletedDocument =
      await this.usersResponsibleRepository.deleteAndReturnDocument({
        _id: userResponsibleId,
      });
    if (!deletedDocument) throw new NotFoundException('O vínculo não existe!');
    return deletedDocument;
  }

  async sendUsersBondRequest(responsibleUserId: string, childCode: string) {
    const { child, responsible } = await this.validateUsersBond(
      childCode,
      responsibleUserId,
      true,
    );
    this.validateIfChildHasBond(child._id.toString());
    const notification = await this.notificationService.findOneByFilter({
      user: child._id.toString(),
      type: NotificationTypes.USER_RESPONSIBLE_INVITE,
      payload: {
        userResponsible: convertToMongoId(responsibleUserId),
        status: UserRequestPayloadStatus.SENDED,
      },
    });

    if (notification)
      throw new BadRequestException(
        'O usuário já possui uma um pedido pendente para avaliar!',
      );

    await this.notificationService.create({
      type: NotificationTypes.USER_RESPONSIBLE_INVITE,
      message: `${responsible.name} quer ser seu(ua) responsável. Deseja aceitar?`,
      payload: {
        responsibleId: responsible._id,
        childId: child._id,
        status: UserRequestPayloadStatus.SENDED,
      },
      checked: false,
      userId: child._id,
    });

    return {
      message: 'Pedido enviado com sucesso!',
      success: true,
    };
  }

  async denyResponsibleRequest(notificationRequestId: string) {
    const notification = await this.notificationService.findOne(
      notificationRequestId,
    );

    if (notification.type !== NotificationTypes.USER_RESPONSIBLE_INVITE)
      throw new BadRequestException(
        'O tipo da notificação deve ser ' +
          NotificationTypes.USER_RESPONSIBLE_INVITE,
      );

    if (notification.payload?.status === UserRequestPayloadStatus.ACCEPTED)
      throw new BadRequestException(
        'O pedido para ser responsável da criança já foi aceito!',
      );

    notification.payload = {
      ...notification?.payload,
      status: UserRequestPayloadStatus.REFUSED,
    };

    return notification.save();
  }
}
