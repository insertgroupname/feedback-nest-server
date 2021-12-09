import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  forwardRef,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { AdminService } from './admin.service';
import { RecordService } from 'src/records/record.service';
import { AnalyticService } from 'src/analytic/analytic.service';
import { Put } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BaselineService } from './baseline.service';
import { BaselineInterface } from './baseline.interface';

@Controller()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    @Inject(forwardRef(() => RecordService))
    private readonly recordService: RecordService,
    private readonly analyticService: AnalyticService,
    private readonly baselineService: BaselineService,
  ) {}

  isAdmin(userType: string) {
    if (userType === 'admin') {
      return true;
    }
    throw new ForbiddenException('forbidden');
  }

  @Get('/v2/admin')
  @UseGuards(JwtAuthGuard)
  async getAdminDetail(@Req() req: any) {
    this.isAdmin(req.user.type);
    return { ...req.user };
  }

  @Get('/v2/admin/userstat')
  @UseGuards(JwtAuthGuard)
  async getAllUserPostProcessing(@Req() req: any) {
    this.isAdmin(req.user.type);
    const postProcessingResult = await this.recordService.findAll(
      {},
      { 'report.postProcessing': 1 },
      { sorts: { createDate: -1 } },
    );
    return postProcessingResult;
  }

  @Get('/v2/admin/allAvg')
  @UseGuards(JwtAuthGuard)
  async getAllAvgAnalytic(@Req() req: any) {
    this.isAdmin(req.user.type);
    const avgStatResult = await this.analyticService.find(
      {},
      { lastVideoUUID: 0 },
      { sort: { createDate: -1 } },
    );
    return avgStatResult;
  }

  @Put('/v2/admin/newAvgStat')
  @UseGuards(JwtAuthGuard)
  async newAvgStat(@Req() req: any) {
    this.isAdmin(req.user.type);
    return await this.doNewAvgStat();
  }

  @Cron('0 12 * * *')
  async doNewAvgStat() {
    const recordDocumentList = await this.recordService.findAll(
      { status: 'done' },
      { videoUUID: 1, 'report.postProcessing': 1 },
      { sort: { createDate: -1 }, collation: { locale: 'en', strength: 2 } },
    );
    const lastAnalytic = await this.analyticService.find(
      {},
      { lastVideoUUID: 1 },
      { sort: { createDate: -1, limit: 1 } },
    );
    if (
      !recordDocumentList.length ||
      (lastAnalytic.length &&
        recordDocumentList[0].videoUUID === lastAnalytic[0].lastVideoUUID)
    ) {
      return 'insufficient new record';
    }

    return this.analyticService.create(recordDocumentList);
  }

  @Post('/v2/admin/setBaseline')
  @UseGuards(JwtAuthGuard)
  async setBaseline(@Req() req: any, @Body() baselineBody: BaselineInterface) {
    this.isAdmin(req.user.type);
    if (baselineBody.WPMrange && baselineBody.WPMrange.length > 5) {
      baselineBody.WPMrange = baselineBody.WPMrange.slice(0, 5);
    }
    if (baselineBody.WPMrange && baselineBody.WPMrange.length < 5) {
      throw new BadRequestException('require WPMrange of 5 range');
    }
    if (baselineBody.WPMrange) {
      const WPMrange = baselineBody.WPMrange;
      for (let range = 0; range < WPMrange.length - 1; range++) {
        if (
          !(
            WPMrange[range][0] < WPMrange[range][1] &&
            WPMrange[range][1] < WPMrange[range + 1][0] &&
            WPMrange[range + 1][0] < WPMrange[range + 1][1]
          )
        ) {
          throw new BadRequestException('Bad WPMrange collapse');
        }
      }
    }
    return await this.baselineService.create(baselineBody);
  }

  @Get('/v2/admin/allBaseline')
  @UseGuards(JwtAuthGuard)
  async getAllBaseline(@Req() req: any) {
    this.isAdmin(req.user.type);
    return await this.baselineService.findAll(
      {},
      {},
      { sort: { createDate: -1 } },
    );
  }

  @Get('/v2/baseline')
  @UseGuards(JwtAuthGuard)
  async getBaseline(@Req() req: any) {
    const baseline = await this.baselineService.findAll(
      {},
      {},
      { sort: { createDate: -1 }, limit: 1 },
    );
    if (!baseline) {
      return 'no baseline shown in server';
    }
    return baseline.pop();
  }
}
