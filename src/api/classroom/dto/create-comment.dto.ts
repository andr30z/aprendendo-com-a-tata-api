import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O id do autor é obrigatório!' })
  authorId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O id do post é obrigatório!' })
  postId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo content é obrigatório!' })
  content: string;
}
