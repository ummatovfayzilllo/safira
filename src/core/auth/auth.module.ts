import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CacheService } from './cache.service';
import { UsersService } from 'src/modules/users/users.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, CacheService, UsersService],
})
export class AuthModule {}
