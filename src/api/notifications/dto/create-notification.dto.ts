import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { NotificationTypes } from '../types';

export class CreateNotificationDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'A mensagem é obrigatória!' })
  @IsString({ message: 'A mensagem deve ser uma string!' })
  message: string;

  @ApiProperty()
  payload: any;

  @ApiProperty()
  @IsEnum(NotificationTypes, { message: 'O campo type é inválido' })
  type: NotificationTypes;

  @ApiProperty()
  @IsMongoId({ message: 'O campo userId não é um ID válido!' })
  userId: string;

  @ApiProperty()
  @IsBoolean({ message: 'O campo checked deve ser um booleano!' })
  checked:boolean
}
