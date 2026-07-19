import { Module } from '@nestjs/common';
import { LastActivityService } from './last_activity.service';
import { LastActivityController } from './last_activity.controller';

@Module({
  controllers: [LastActivityController],
  providers: [LastActivityService],
})
export class LastActivityModule {}
