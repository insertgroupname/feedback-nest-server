import {
  BadRequestException,
  Body,
  Controller,
  Get,
  GoneException,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

import { Record } from './schemas/record.schema';
import { RecordService } from './record.service';
import { RecordInterface } from './record.interface';
import { videoUploadOption } from './video-upload.option';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';

@Controller()
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  checkNull(obj: any): any | Error {
    if (!obj) {
      throw new BadRequestException('not found or unauthorized');
    }
    return obj;
  }

  /* record tag */
  @Get('/v2/record/tag/')
  @UseGuards(JwtAuthGuard)
  async findByTag(@Req() req: any): Promise<Record[] | Error> {
    const requestedDocument = this.checkNull(
      await this.recordService.findAll({
        userId: req.user.userId,
        tags: req.query.tag,
      }),
    );
    return requestedDocument;
  }

  /* update tag */
  @Patch('/v2/record/report/:videoUUID')
  @UseGuards(JwtAuthGuard)
  async updateTag(@Param('videoUUID') videoUUID, @Req() req: any) {
    return await this.recordService.updateOne(
      { userId: req.user.userId, videoUUID: new RegExp(videoUUID, 'i') },
      { $set: { tags: req.body.tags } },
    );
  }

  /* landing page */
  @Get('/v2/record/landing')
  @UseGuards(JwtAuthGuard)
  async landingPage(@Req() req: any): Promise<Record[] | Error> {
    const requestedDocument = this.checkNull(
      await this.recordService.findAll(
        { userId: req.user.userId },
        { report: 0 },
        { createDate: -1 },
      ),
    );
    return requestedDocument;
  }

  /* specific video */

  @Get('/v2/record/report/:videoUUID')
  @UseGuards(JwtAuthGuard)
  async selectRecord(
    @Param('videoUUID') videoUUID: string,
    @Req() req: any,
  ): Promise<Record> {
    console.log(req.user.userId);
    const requestedDocument = this.checkNull(
      await this.recordService.findOne({
        userId: req.user.userId,
        videoUUID: new RegExp(videoUUID, 'i'),
      }),
    );
    return requestedDocument;
  }

  async createRecord(uploadDetail: RecordInterface) {
    return await this.recordService.insertOne(uploadDetail);
  }

  /* upload */
  @Post('/v2/upload')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', videoUploadOption()))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDetail: RecordInterface,
    @Req() req: any,
  ) {
    if (!uploadDetail.videoName) {
      uploadDetail.videoName =
        file.originalname + '.' + file.originalname.split('.').pop();
    }
    uploadDetail.userId = req.user.userId;
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
  @Get('/v2/record/streaming/:videoUUID')
  @UseGuards(JwtAuthGuard)
  async streamingFile(
    @Req() req: any,
    @Res() res: Response,
    @Param('videoUUID') videoUUID: string,
  ) {
    const targetExt = 'mp4';
    const result = await this.recordService.findOne({
      userId: req.user.userId,
      videoUUID: new RegExp(videoUUID, 'i'),
    });
    if (result) {
      const filePath = path.join(
        'upload',
        'video',
        videoUUID + '.' + targetExt,
      );
      console.log(filePath);
      console.log(fs.existsSync(filePath));
      if (fs.existsSync(filePath)) {
        const file = fs.createReadStream(
          path.join('upload', 'video', videoUUID + '.' + targetExt),
        );
        res.writeHead(206, 'streaming');
        return file.pipe(res);
      } else {
        throw new GoneException('file does not exist in server');
      }
    } else {
      throw new BadRequestException('content unavailable or not found');
    }
  }
}
