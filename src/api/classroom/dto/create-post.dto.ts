import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, Validate, ValidateIf } from 'class-validator';
import { Types } from 'mongoose';
import { PostTypes } from 'src/api/classroom/types';
import { IsArrayOfMongoIds } from 'src/validations';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O authorId é obrigatório!' })
  authorId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O classroomId é obrigatório!' })
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
  @IsArray({ message: 'O campo activities deve ser um array!' })
  @IsNotEmpty({ message: 'O campo activities é obrigatório!' })
  @ArrayMinSize(1, { message: "O campo activities deve ter a quantidade mínima de 1 item." })
  @Validate(IsArrayOfMongoIds, { message: "Um ou mais itens do array não possuem um Id válido" })
  @ValidateIf((dto) => dto.type === PostTypes.A)
  activities?: Array<Types.ObjectId>
}
