import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { ActivityAnswers } from '../types';

export class UpdateActivityResultDto {
  @ApiProperty()
  @IsMongoId({ message: 'O campo activityId não é um ID válido!' })
  activityId: string;
  @ApiProperty()
  @IsOptional()
  @IsMongoId({ message: 'O campo activityResultId não é um ID válido!' })
  activityResultId?: string;

  @ApiProperty()
  @IsBoolean({ message: 'O campo finished deve ser do tipo booleano' })
  finished: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo activityAnswers é obrigatório!' })
  @IsArray({ message: 'O campo activityAnswers deve ser um array!' })
  activityAnswers: Array<ActivityAnswers>;
}
