import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { UpsertActivityResultDto } from 'src/api/activities';

export class StartActivityDto extends UpsertActivityResultDto {
    @ApiProperty()
    @IsMongoId({ message: 'O campo userId não é um ID válido!' })
    userId: string;
}
