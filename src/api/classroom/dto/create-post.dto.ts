import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
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
  @ApiProperty({ enum: { C: 'C', R: 'R', T: 'T' } })
  type: PostTypes;
}
