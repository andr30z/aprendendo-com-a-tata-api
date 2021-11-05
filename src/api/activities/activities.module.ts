import { CacheModule, Module } from '@nestjs/common';
import { ActivitiesService } from './services';
import { ActivitiesController } from './controllers';
import { ActivitiesRepository } from './repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { Activity, ActivitySchema } from './entities/activity.entity';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivitiesRepository],
  exports: [ActivitiesService, ActivitiesRepository],
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
})
export class ActivitiesModule {}