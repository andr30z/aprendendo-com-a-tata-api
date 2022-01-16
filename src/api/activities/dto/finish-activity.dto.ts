import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { ActivityAnswers } from '../types';

export class FinishActivityResultDto {
  @ApiProperty()
  @IsMongoId({ message: 'O campo activityId não é um ID válido!' })
  activityId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo activityAnswers é obrigatório!' })
  @IsArray({ message: 'O campo activityAnswers deve ser um array!' })
  activityAnswers: Array<ActivityAnswers>;
}
