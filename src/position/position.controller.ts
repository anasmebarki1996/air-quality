import { Controller, Get, Query } from '@nestjs/common';
import { PositionService } from './position.service';
import { queryDTO } from './dto/query.dto';

@Controller('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Get('/air-quality')
  findOne(@Query() query: queryDTO) {
    return this.positionService.findPosition(query);
  }

  @Get('/air-quality/max-paris-zone')
  findMaxParisZone() {
    return this.positionService.mostPollutedTimeZone(48.856613, 2.352222);
  }
}
