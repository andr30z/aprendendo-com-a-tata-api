import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/api/users';
import JwtAuthenticationGuard from 'src/api/authentication/jwt-authentication.guard';
import { MongoSerializerInterceptor } from 'src/interceptors';
import { UpdateActivityResultDto } from '../dto';
import { ActivityResult } from '../entities';
import { ActivityResultService } from '../services';

@UseInterceptors(MongoSerializerInterceptor(ActivityResult))
@ApiCookieAuth()
@ApiTags('Activity Result')
@UseGuards(JwtAuthenticationGuard)
@Controller('v1/activities-results')
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

  @Put('user/:userId')
  updateResult(
    @Param('userId') userId: string,
    @Body() activityResultUpsertDto: UpdateActivityResultDto,
  ) {
    return this.activityResultService.updateActivityResult(
      userId,
      activityResultUpsertDto,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityResultService.findOne(id);
  }
}
