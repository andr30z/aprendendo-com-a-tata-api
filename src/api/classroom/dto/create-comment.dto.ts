import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O id do autor é obrigatório!' })
  authorId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O id do post é obrigatório!' })
  postId: string;

  @ApiProperty()
  @IsString({ message: "O campo content é uma string" })
  @IsNotEmpty({ message: 'O campo content é obrigatório!' })
  content: string;
}
