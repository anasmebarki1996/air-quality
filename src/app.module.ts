import { Module } from '@nestjs/common';
import { PositionModule } from './position/position.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    PositionModule,
    ScheduleModule.forRoot(),
    CronModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
