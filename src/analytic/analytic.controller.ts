import { Controller, Get, Post } from '@nestjs/common';
import { AnalyticService } from './analytic.service';
import { RecordService } from 'src/records/record.service';

@Controller()
export class AnalyticController {
  constructor(
    private readonly analyticService: AnalyticService,
    private readonly recordService: RecordService,
  ) {}

  @Get('/v2/analytic/avgstat')
  async getAverageStat() {
    const avgStatResult = await this.analyticService.find(
      {},
      { lastVideoUUID: 0 },
      { sort: { createDate: -1 }, limit: 1 },
    );

    if (!avgStatResult.length) {
      return 'no average analytic so far';
    }
    return avgStatResult;
  }
}
