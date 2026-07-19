import { Module } from '@nestjs/common';
import { MentorProfilesService } from './mentor_profiles.service';
import { MentorProfilesController } from './mentor_profiles.controller';

@Module({
  controllers: [MentorProfilesController],
  providers: [MentorProfilesService],
})
export class MentorProfilesModule {}
