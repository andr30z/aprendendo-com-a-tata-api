import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/api/authentication/jwt-authentication.guard';
import {
  MongoSerializerInterceptor,
  NotFoundInterceptor,
} from 'src/interceptors';
import { ActivityResult } from '../entities';
import { UpsertActivityResultDto } from '../dto';
import { ActivityResultService } from '../services';

@UseInterceptors(new NotFoundInterceptor())
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

  @Post('user/:id')
  createOrUpdateResult(
    @Param('id') userId,
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
