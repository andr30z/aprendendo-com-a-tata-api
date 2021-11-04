import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateClassroomDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo teacherId é obrigatório!' })
  teacherId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo nome é obrigatório!' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'A foto da classe é obrigatória!' })
  classPhoto: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'A cor da classe é obrigatória!' })
  color: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'A cor de texto da classe é obrigatória!' })
  textColor: string;
  @ApiProperty()
  tags: Array<string>;
}
