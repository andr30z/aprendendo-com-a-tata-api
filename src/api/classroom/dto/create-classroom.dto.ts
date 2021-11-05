import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClassroomDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo teacherId é obrigatório!' })
  teacherId: string;

  @ApiProperty()
  @IsString({ message: "O campo name é uma string" })
  @IsNotEmpty({ message: 'O campo name é obrigatório!' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo classPhoto é obrigatório!' })
  classPhoto: string;
  @ApiProperty()
  @IsOptional()
  @IsString({ message: "O campo description é uma string" })
  description: string;
  @ApiProperty()
  @IsString({ message: "O campo color é uma string" })
  @IsNotEmpty({ message: 'O campo color é obrigatório!' })
  color: string;
  @ApiProperty()
  @IsString({ message: "O campo textColor é uma string" })
  @IsNotEmpty({ message: 'O campo textColor é obrigatório!' })
  textColor: string;
  @ApiProperty()
  tags: Array<string>;
}
