import {
  CacheInterceptor,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import JwtAuthenticationGuard from 'src/api/authentication/jwt-authentication.guard';
import { NotFoundInterceptor } from 'src/interceptors';
import { ActivitiesService } from '../services';

@UseInterceptors(new NotFoundInterceptor())
@ApiCookieAuth()
@ApiTags('Activities')
@UseGuards(JwtAuthenticationGuard)
@Controller('v1/activities')
export class ActivitiesController {
  constructor(
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly activitiesService: ActivitiesService,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll() {
    return this.activitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(id);
  }
}