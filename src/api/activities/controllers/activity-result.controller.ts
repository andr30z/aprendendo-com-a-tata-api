import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/api/users';
import JwtAuthenticationGuard from 'src/api/authentication/jwt-authentication.guard';
import { MongoSerializerInterceptor } from 'src/interceptors';
import { UpdateActivityResultDto, FinishActivityResultDto } from '../dto';
import { ActivityResult } from '../entities';
import { ActivityResultService } from '../services';
import { PaginationParams } from 'src/database/pagination-params';

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

  @Put('users/:userId')
  updateResult(
    @Param('userId') userId: string,
    @Body() activityResultUpsertDto: UpdateActivityResultDto,
  ) {
    return this.activityResultService.updateActivityResult(
      userId,
      activityResultUpsertDto,
    );
  }

  @Post('users/:userId')
  finishActivity(
    @Param('userId') userId: string,
    @Body() finishActivityResultDto: FinishActivityResultDto,
  ) {
    return this.activityResultService.finishActivity(
      userId,
      finishActivityResultDto,
    );
  }
  @Get('users/:userId')
  getByUserId(
    @Param('userId') id: string,
    @Query() pagination: PaginationParams,
  ) {
    return this.activityResultService.findManyByUserId(id, pagination);
  }

  @Get('user-responsible/:id')
  getByUserResponsibleId(
    @Param('id') id: string,
    @Query() pagination: PaginationParams,
  ) {
    return this.activityResultService.getChildActivitiesResultsByResponsibleUserId(
      id,
      pagination,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityResultService.findOne(id);
  }
}
