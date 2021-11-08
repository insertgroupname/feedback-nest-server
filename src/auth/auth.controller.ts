import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Res,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { LoginDto } from '../user/dto/login-user.dto';
import * as mongoose from 'mongoose';
import { UserService } from '../user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { UpdateInterface } from 'src/user/user.interface';
import { JwtAuthGuard } from './jwt.auth-guard';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/v2/register')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.findOne({
      email: createUserDto.email,
    });
    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }
    const createdUserObj = await this.userService.create(createUserDto);
    const token = await this.authService.signPayload({
      email: createdUserObj.email,
      userId: createdUserObj._id,
    });
    delete createdUserObj['_id'];
    res.cookie('jwt', token, { maxAge: 86400000 });
    return res.json({ createdUser: createdUserObj });
  }

  @Get('/v2/user/data')
  @UseGuards(JwtAuthGuard)
  async getUserData(@Req() req: any) {
    const result = await this.userService.findOne(
      {
        userId: req.user.userId,
      },
      { password: 0, _id: 0 },
    );
    return result;
  }

  @Post('/v2/login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.userService.findOne({ email: loginDto.email });
    if (
      user &&
      user.password &&
      (await bcrypt.compare(loginDto.password, user.password))
    ) {
      const userObj = user.toObject();
      const token = await this.authService.signPayload({
        email: userObj.email,
        userId: userObj._id,
      });
      delete userObj['password'];
      delete userObj['_id'];

      res.cookie('jwt', token, { maxAge: 86400000 });
      return res.json({ userObj });
    }

    throw new HttpException(
      `invalid credential or user doesn't exist`,
      HttpStatus.BAD_REQUEST,
    );
  }

  @Patch('/v2/user/data/edit')
  @UseGuards(JwtAuthGuard)
  async updateStopwordOrTags(
    @Req() req: any,
    @Body() updateBody: UpdateInterface,
  ) {
    return await this.userService.updateOne(
      { _id: req.user.userId },
      { $set: { ...updateBody } },
    );
  }
}
