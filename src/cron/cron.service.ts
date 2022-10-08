import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PositionService } from '../position/position.service';

@Injectable()
export class CronService {
  constructor(private readonly positionService: PositionService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  saveParisZoneposition() {
    // the Paris zone ( latitude:48.856613 ,longitude: 2.352222)
    this.positionService.create(48.856613, 2.352222);
  }
}
