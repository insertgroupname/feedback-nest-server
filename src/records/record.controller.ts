import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import short from 'short-unique-id';

import { Record } from './record.schema';
import { RecordService } from './record.service';
import { RecordInterface } from './record.interface';
import { videoUploadOption } from './video-upload.option';

@Controller()
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  /* record tag */
  @Get('/v2/record/tag/:userId/')
  async findByTag(
    @Param('userId') userId: string,
    @Req() req: Request,
  ): Promise<Record[]> {
    return await this.recordService.findAll({
      userId: userId,
      tags: req.query.tag,
    });
  }
  /* update tag */
  @Patch('/v2/record/report/:userId/:videoUUID')
  async updateTag(
    @Param('userId') userId,
    @Param('videoUUID') videoUUID,
    @Req() req: Request,
  ) {
    return this.recordService.updateOne(
      { userId: userId, videoUUID: new RegExp(videoUUID, 'i') },
      { $set: { tags: req.body.tags } },
    );
  }

  /* landing page */
  @Get('/v2/record/landing/:userId')
  async landingPage(@Param('userId') userId: string): Promise<Record[]> {
    console.log(userId);
    return await this.recordService.findAll(
      { userId: userId },
      { report: 0 },
      { createDate: -1 },
    );
  }

  /* specific video */
  @Get('/v2/record/report/:userId/:videoUUID')
  async selectRecord(
    @Param('userId') userId: string,
    @Param('videoUUID') videoUUID: string,
  ): Promise<Record> {
    return await this.recordService.findOne({
      userId: userId,
      videoUUID: new RegExp(videoUUID, 'i'),
    });
  }

  @Get('/v2/uuid')
  getUUID() {
    return new short({ length: 32 })();
  }

  async createRecord(uploadDetail: RecordInterface) {
    return await this.recordService.insertOne(uploadDetail);
  }

  /* upload */
  @Post('/v2/upload')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file', videoUploadOption()))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDetail: RecordInterface,
  ) {
    if (!uploadDetail.videoName) {
      uploadDetail.videoName =
        file.originalname + '.' + file.originalname.split('.').pop();
    }
    uploadDetail.videoUUID = file.filename;
    uploadDetail.status = 'waiting_for_process_transcript';
    const createResult = await this.createRecord(uploadDetail);
    axios({
      method: 'post',
      url: `http://python-server:5000/convert_sound`,
      params: { file_name: file.filename },
    });
    return createResult;
  }

  /* streaming */
  @Get('/v2/streaming/:userId/:videoUUID')
  async streamingFile(
    @Res() res: Response,
    @Param('userId') userId: string,
    @Param('videoUUID') videoUUID: string,
  ) {
    const targetExt = 'mp4';
    const result = await this.recordService.findOne({
      userId: userId,
      videoUUID: new RegExp(videoUUID, 'i'),
    });
    if (result) {
      const file = fs.createReadStream(
        path.join('upload', 'video', videoUUID + '.' + targetExt),
      );
      res.writeHead(206, 'streaming');
      return file.pipe(res);
    } else {
      return res.json({ message: 'content unavailable' });
    }
  }
}
