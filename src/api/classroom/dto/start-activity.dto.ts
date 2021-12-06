import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { UpdateActivityResultDto } from 'src/api/activities';

export class StartActivityDto extends UpdateActivityResultDto {
    @ApiProperty()
    @IsMongoId({ message: 'O campo userId não é um ID válido!' })
    userId: string;
}
