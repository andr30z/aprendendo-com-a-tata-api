import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty, MaxLength,
  Min,
  MinLength
} from 'class-validator';
import { UserType } from '../types';

export class CreateUserDto {
  @IsEmail({}, { message: 'O campo email é inválido!' })
  @ApiProperty()
  email: string;
  @IsEnum(UserType, { message: 'O campo tipo é inválido' })
  @ApiProperty({ enum: { C: 'C', R: 'R', T: 'T' } })
  type: UserType;
  @IsNotEmpty({ message: 'O campo senha é obrigatório!' })
  @MinLength(8, { message: 'A senha deve conter pelo menos 6 dígitos' })
  @ApiProperty()
  password: string;
  @MaxLength(50)
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo nome é obrigatório!' })
  name: string;

  @ApiProperty()
  profilePhoto: string;

  @ApiProperty()
  @Transform((v) => Number(v.obj.age))
  @Min(1)
  @IsInt({ message: "O campo age deve ser um número inteiro", })
  age: number;
}
