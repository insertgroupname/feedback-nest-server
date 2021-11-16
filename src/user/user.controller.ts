import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { RecordService } from 'src/records/record.service';
import { UpdateInterface } from './user.interface';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly recordService: RecordService,
  ) {}

  @Get('/v2/user/data')
  @UseGuards(JwtAuthGuard)
  async getUserData(@Req() req: any) {
    const result = await this.userService.findOne(
      {
        _id: req.user.userId,
      },
      { password: 0, _id: 0 },
    );
    return result;
  }

  @Patch('/v2/user/data/edit')
  @UseGuards(JwtAuthGuard)
  async updateStopwordOrTags(
    @Req() req: any,
    @Body() updateBody: UpdateInterface,
  ) {
    const updatedUser = await this.userService.updateOne(
      { _id: req.user.userId },
      { $set: { ...updateBody } },
    );
    if (updatedUser.modifiedCount > 0 && updateBody.tags) {
      const updatedRecord = await this.recordService.updateAll(
        {
          userId: req.user.userId,
        },
        { $pull: { tags: { $nin: updateBody.tags } } },
      );
      return {
        modifiedUser: updatedUser.modifiedCount,
        modifiedRecord: updatedRecord.modifiedCount,
      };
    }
    return { modifiedUser: updatedUser.modifiedCount, modifiedRecord: 0 };
  }
}
