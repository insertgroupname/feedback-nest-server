import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Record } from './record.schema';
import { RecordService } from './record.service';
import { RecordInterface } from './record.interface';
import { videoUploadOption } from './video-upload.option';
import short from 'short-unique-id';

@Controller()
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  /* landing page */
  @Get('/v2/record/:userId')
  async landingPage(@Param('userId') userId: string): Promise<Record[]> {
    console.log(userId);
    return await this.recordService.findAll(
      { userId: userId },
      { report: 0 },
      { createDate: -1 },
    );
  }

  /* specific video */
  @Get('/v2/record/:userId/:videoUUID')
  async selectRecord(
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
  @Get('/uuid')
  getUUID() {
    return new short({ length: 32 })();
    // return shortUUID.generate();
  }

  async createRecord(body: any) {
    return await this.recordService.insertOne(body);
  }
  /* upload */
  @Post('/v2/upload')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file', videoUploadOption()))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadObject: RecordInterface,
  ) {
    if (!uploadObject.videoName) {
      uploadObject.videoName =
        file.originalname + '.' + file.originalname.split('.').pop();
    }
    uploadObject.videoUUID = file.filename;
    return await this.createRecord(uploadObject);
    // return 'success';
  }
  /* streaming */
}
