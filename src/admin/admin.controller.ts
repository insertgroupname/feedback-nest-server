import {
  Controller,
  ForbiddenException,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';

import { AdminService } from './admin.service';
import { RecordService } from 'src/records/record.service';

@Controller()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly recordService: RecordService,
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

  @Get('/v2/admin/useranalytic')
  @UseGuards(JwtAuthGuard)
  async getAllUserPostProcessing(@Req() req: any) {
    this.isAdmin(req.user.type);
    const postProcessingResult = await this.recordService.findAll({},{'report.postProcessing' : 1})
    console.log(postProcessingResult.length)
    return postProcessingResult;
  }
}
