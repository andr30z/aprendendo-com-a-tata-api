import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { NotFoundInterceptor } from 'src/interceptors';
import { ActivitiesService } from '../services';

@UseInterceptors(new NotFoundInterceptor())
@ApiCookieAuth()
@ApiTags('Activities')
@Controller('v1/activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  findAll() {
    return this.activitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(id);
  }
}
