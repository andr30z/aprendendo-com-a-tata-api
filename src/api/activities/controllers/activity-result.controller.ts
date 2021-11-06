import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/api/authentication/jwt-authentication.guard';
import {
  MongoSerializerInterceptor
} from 'src/interceptors';
import { UpsertActivityResultDto } from '../dto';
import { ActivityResult } from '../entities';
import { ActivityResultService } from '../services';

@UseInterceptors(MongoSerializerInterceptor(ActivityResult))
@ApiCookieAuth()
@ApiTags('Activity Result')
@UseGuards(JwtAuthenticationGuard)
@Controller('v1/activity-result')
export class ActivityResultController {
  constructor(
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly activityResultService: ActivityResultService,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll() {
    return this.activityResultService.findAll();
  }

  @ApiOperation({
    description:
    'This endpoint executes an Upsert operation, i.e: if activityResultId provided on body request is null (or not found in database) it will create and return a new ActivityResult entity, otherwise will update the existing document',
  })
  @Post('upsert/user/:id')
  createOrUpdateResult(
    @Param('id') userId: string,
    @Body() activityResultUpsertDto: UpsertActivityResultDto,
  ) {
    return this.activityResultService.upsertActivityResult(
      userId,
      activityResultUpsertDto,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityResultService.findOne(id);
  }
}
