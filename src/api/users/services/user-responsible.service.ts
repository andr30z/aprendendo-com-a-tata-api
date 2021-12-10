import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationsService } from 'src/api/notifications';
import { NotificationTypes } from 'src/api/notifications/types';
import { isFromClass, isValidMongoId } from 'src/utils';
import { User } from 'src/api/users';
import { UserResponsibleRepository } from '../repositories';
import { UsersService } from './users.service';

@Injectable()
export class UserResponsibleService {
  constructor(
    private readonly usersResponsibleRepository: UserResponsibleRepository,
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
  ) {}

  async createUsersBond(userResponsibleId: string, userChildId: string) {
    isValidMongoId(userResponsibleId);
    isValidMongoId(userChildId);

    const responsibleDocument = await this.usersResponsibleRepository.findOne({
      child: userChildId as any,
    });
    if (responsibleDocument)
      throw new ConflictException('A criança já possui vínculo!');

    const childUser = await this.userService.getByCode(userChildId);
    const responsibleUser = await this.userService.getById(userResponsibleId);

    if (
      !this.userService.userIsChildren(childUser) ||
      this.userService.userIsChildren(responsibleUser)
    )
      throw new BadRequestException(
        'Os usuários não são do tipo adequado para a vinculação!',
      );
    return this.usersResponsibleRepository.create({
      child: userChildId,
      responsibleUser: userChildId,
    });
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
    const userResponsible = await this.userService.getById(responsibleUserId);
    const child = await this.userService.getByCode(childCode);

    if (
      !this.userService.userIsResponsible(userResponsible) ||
      !this.userService.userIsTeacher(userResponsible)
    )
      throw new BadRequestException(
        'O usuário responsável deve ser to tipo T ou R',
      );
    if (!this.userService.userIsChildren(child))
      throw new BadRequestException('O usuário criança deve ser to tipo C');

    await this.notificationService.create({
      type: NotificationTypes.USER_RESPONSIBLE_INVITE,
      message: `${userResponsible.name} quer ser seu responsável. Deseja aceitar?`,
      payload: {
        responsableId: userResponsible._id,
        childId: child._id,
      },
      userId: child._id,
    });

    return {
      message: 'Pedido enviado com sucesso!',
      success: true,
    };
  }
}
