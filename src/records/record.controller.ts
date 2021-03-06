import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  GoneException,
  HttpCode,
  HttpStatus,
  Inject,
  NotAcceptableException,
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
import glob from 'glob';

import { Record } from './schemas/record.schema';
import { RecordService } from './record.service';
import {
  GetTagInterface,
  RecordInterface,
  UpdateInterface,
} from './record.interface';
import { videoUploadOption } from './video-upload.option';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { PostProcessingInterface } from './report.interface';
import {
  doAllAnalytic,
  doAllAverage,
  doAvgScoring,
} from 'src/analytic/analytic.formula';

import { getVideoDurationInSeconds } from 'get-video-duration';
import { BaselineService } from 'src/admin/baseline.service';
import { Baseline } from 'src/admin/schemas/baseline.schema';

@Controller()
export class RecordController {
  constructor(
    private readonly recordService: RecordService,
    @Inject(forwardRef(() => BaselineService))
    private readonly baselineService: BaselineService,
  ) {}

  checkNull(obj: any): any | Error {
    if (!obj) {
      throw new BadRequestException('not found or unauthorized');
    }
    return obj;
  }

  /* landing page */
  @Get('/v2/record/landing')
  @UseGuards(JwtAuthGuard)
  async landingPage(@Req() req: any): Promise<Record[] | Error> {
    const requestedDocument = this.checkNull(
      await this.recordService.findAll(
        { userId: req.user.userId },
        { report: 0, userId: 0 },
        { createDate: -1 },
      ),
    );
    return requestedDocument;
  }

  /* record tag */
  @Get('/v2/record/tag/')
  @UseGuards(JwtAuthGuard)
  async findByTag(@Req() req: any): Promise<Record[] | Error> {
    const requestedDocument = this.checkNull(
      await this.recordService.findAll(
        {
          userId: req.user.userId,
          tags: req.query.tag,
        },
        { userId: 0 },
      ),
    );
    return requestedDocument;
  }

  @Get('/v2/record/report/analytic/')
  @UseGuards(JwtAuthGuard)
  async getUserAnalytic(@Req() req: any) {
    const tag = req.query.tag;
    const queryObject =
      !tag || tag === 'all'
        ? { userId: req.user.userId, status: 'Done' }
        : { userId: req.user.userId, status: 'Done', tags: req.query.tag };
    const recordBytagsList = await this.recordService.findAll(
      queryObject,
      { 'report.postProcessing': 1, videoUUID: 1, videoName: 1 },
      { sorts: { createDate: -1 }, collation: { locale: 'en', strength: 2 } },
    );

    if (!recordBytagsList.length) {
      return 'insufficient record';
    }

    const WPMrange = (
      await this.baselineService.findAll(
        {},
        { WPMrange: 1 },
        { sort: { createDate: -1 }, limit: 1 },
      )
    ).pop().WPMrange;

    console.log(WPMrange);
    const postProcessingList: PostProcessingInterface[] = recordBytagsList.map(
      (record) => {
        let postProcessing = record.report.postProcessing;
        return {
          ...postProcessing,
          videoUUID: record.videoUUID,
          videoName: record.videoName,
        };
      },
    );

    const avgResult = doAllAverage(postProcessingList);
    const scoringResult = doAvgScoring(avgResult, WPMrange);
    const allVideoAnalytic = doAllAnalytic(postProcessingList);
    return {
      avgResult: avgResult,
      scoringResult: scoringResult,
      allVideoAnalytic: allVideoAnalytic,
    };
  }

  /* update tag */
  @Patch('/v2/record/report/:videoUUID')
  @UseGuards(JwtAuthGuard)
  async updateTag(
    @Param('videoUUID') videoUUID,
    @Req() req: any,
    @Body() updateBody: UpdateInterface,
  ) {
    const updatedRecord = await this.recordService.updateOne(
      { userId: req.user.userId, videoUUID: new RegExp(videoUUID, 'i') },
      { $set: { ...updateBody, lastUpdate: new Date() } },
    );
    return { modifiedRecord: updatedRecord.modifiedCount };
  }

  /* specific video */
  @Get('/v2/record/report/:videoUUID')
  @UseGuards(JwtAuthGuard)
  async selectRecord(
    @Param('videoUUID') videoUUID: string,
    @Req() req: any,
  ): Promise<Record> {
    const requestedDocument = this.checkNull(
      await this.recordService.findOne(
        {
          userId: req.user.userId,
          videoUUID: new RegExp(videoUUID, 'i'),
        },
        { userId: 0 },
      ),
    );
    return requestedDocument;
  }

  async createRecord(uploadDetail: RecordInterface) {
    return await this.recordService.insertOne(uploadDetail);
  }

  @Delete('/v2/record/report/:videoUUID')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async deleteRecord(@Param('videoUUID') videoUUID: string, @Req() req: any) {
    const result = this.recordService.findOneAndDelete({
      userId: req.user.userId,
      videoUUID: new RegExp(videoUUID, 'i'),
    });
    if (result) {
      return 'delete succussfully';
      // glob(`upload/**/${videoUUID}.*`, function (er, files) {
      //   for (const file of files) {
      //     fs.unlinkSync(file);
      //   }
      // });
      // axios({
      //   method: 'post',
      //   url: `http://python-server:5000/delete_record`,
      //   params: { videoUUID: videoUUID },
      // });
    }
    return 'nothing has been deleted';
  }

  /* streaming */
  @Get('/v2/record/streaming/:videoUUID')
  @UseGuards(JwtAuthGuard)
  async streamingFile(
    @Req() req: any,
    @Res() res: Response,
    @Param('videoUUID') videoUUID: string,
  ) {
    // const targetExt = 'mp4';
    const result = await this.recordService.findOne({
      userId: req.user.userId,
      videoUUID: new RegExp(videoUUID, 'i'),
    });
    if (result) {
      const filePath = path.join(
        'upload',
        'audio',
        videoUUID.split('.')[0] + '.ogg',
      );
      if (fs.existsSync(filePath)) {
        const file = fs.createReadStream(
          path.join('upload', 'video', videoUUID),
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
    if (file.path && (await getVideoDurationInSeconds(file.path)) > 1200) {
      fs.unlinkSync(file.path);
      throw new NotAcceptableException(
        'content length should not bigger than 1200 seconds',
      );
    }

    if (!uploadDetail.videoName) {
      uploadDetail.videoName =
        file.originalname + '.' + file.originalname.split('.').pop();
    }
    uploadDetail.userId = req.user.userId;
    uploadDetail.videoUUID = file.filename;
    uploadDetail.stopwords = req.user.stopwords;
    uploadDetail.status = 'waiting_for_process_transcript';
    const createResult = await this.createRecord(uploadDetail);
    axios({
      method: 'post',
      url: `http://python-server:5000/convert_sound`,
      params: { file_name: file.filename },
    });
    return createResult;
  }
}
