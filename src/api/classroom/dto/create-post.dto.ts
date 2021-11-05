import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { Types } from 'mongoose';
import { PostTypes } from 'src/api/classroom/types';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O id do autor é obrigatório!' })
  authorId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O id da classe é obrigatório!' })
  classroomId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo text é obrigatório!' })
  text: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  allowComments?: boolean;

  @IsEnum(PostTypes, { message: 'O campo type é inválido' })
  @ApiProperty({ enum: { A: 'A', N: 'N', } })
  type: PostTypes;

  @ApiProperty()
  @IsOptional()
  @IsArray({ message: 'O campo activities deve ser um array!' })
  @ValidateIf((dto) => dto.type === PostTypes.A)
  activities?: Array<Types.ObjectId>
}
