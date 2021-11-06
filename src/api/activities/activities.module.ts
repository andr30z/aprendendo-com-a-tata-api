import { CacheModule, Module } from '@nestjs/common';
import { ActivitiesService, ActivityResultService } from './services';
import { ActivitiesController, ActivityResultController } from './controllers';
import { ActivitiesRepository, ActivityResultRepository } from './repositories';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ActivityResult,
  ActivityResultSchema,
  Activity,
  ActivitySchema,
} from './entities';
import { UsersModule } from '../users';

@Module({
  controllers: [ActivitiesController, ActivityResultController],
  providers: [
    ActivitiesService,
    ActivitiesRepository,
    ActivityResultRepository,
    ActivityResultService,
  ],
  exports: [
    ActivitiesService,
    ActivitiesRepository,
    ActivityResultRepository,
    ActivityResultService,
  ],
  imports: [
    UsersModule,
    CacheModule.register(),
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
      { name: ActivityResult.name, schema: ActivityResultSchema },
    ]),
  ],
})
export class ActivitiesModule {}
