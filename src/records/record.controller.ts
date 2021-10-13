import { Controller, Get, Param } from '@nestjs/common';
import { Record, RecordSchema } from './record.schema';
import { RecordService } from './record.service';

@Controller()
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  /* landing page */
  @Get('/v2/record/:userId')
  async landingPage(@Param('userId') userId: string): Promise<Record[]> {
    console.log(userId);
    return await this.recordService.findAll(
      { userId: userId },
      // { report: 0 },
      // { createDate: -1 },
    );
  }

  /* specific video */
  @Get('/v2/record/:userId/:videoUUID')
  async selectVideo(
    @Param('videoUUID') videoUUID: string,
    @Param('userId') userId: string,
  ): Promise<Record> {
    return await this.recordService.findOne({
      userId: userId,
      videoUUID: videoUUID,
    });
  }

  /* */
  // @Get('/v2/record/:userId/:tag')
  // async findTag(): Promise<Record> {
  //   return await this.recordService.findOne({});
  // }
}
