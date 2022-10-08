import { Module } from '@nestjs/common';
import { PositionModule } from '../position/position.module';
import { CronService } from './cron.service';

@Module({
  imports: [PositionModule],
  providers: [CronService],
})
export class CronModule {}
