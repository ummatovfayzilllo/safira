import { PartialType } from '@nestjs/swagger';
import { CreateLastActivityDto } from './create-last_activity.dto';

export class UpdateLastActivityDto extends PartialType(CreateLastActivityDto) {}
