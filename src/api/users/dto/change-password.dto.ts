import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo currentPassword está vazio!' })
  currentPassword: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'O campo newPassword está vazio!' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
