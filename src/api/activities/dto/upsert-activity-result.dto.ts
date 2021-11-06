import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { ActivityAnswers } from '../types';

export class UpsertActivityResultDto {
  @ApiProperty()
  @IsMongoId({ message: 'O campo userId não é um ID válido!' })
  userId: string;
  @ApiProperty()
  @IsMongoId({ message: 'O campo activityId não é um ID válido!' })
  activityId: string;
  @ApiProperty()
  @IsMongoId({ message: 'O campo activityResultId não é um ID válido!' })
  activityResultId: string;

  @ApiProperty()
  @IsBoolean({ message: 'O campo finished deve ser do tipo booleano' })
  finished: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo activityAnswers é obrigatório!' })
  activityAnswers: ActivityAnswers;
}
