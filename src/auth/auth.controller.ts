import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { LoginDto } from '../user/dto/login-user.dto';

import { UserService } from '../user/user.service';
import { AuthService } from 'src/auth/auth.service';

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
    const createdUser = await this.userService.create(createUserDto);
    const token = await this.authService.signPayload(createUserDto);
    res.cookie('jwt', token, { maxAge: 86400000 });
    return res.json({ createdUser });
  }

  @Post('/v2/login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.userService.findOne({ email: loginDto.email });
    if (
      user &&
      user.password &&
      (await bcrypt.compare(loginDto.password, user.password))
    ) {
      const token = await this.authService.signPayload(loginDto);
      const userObj = user.toObject();
      delete userObj['password'];
      res.cookie('jwt', token, { maxAge: 86400000 });

      return res.json({ userObj });
    }

    throw new HttpException(
      `invalid credential or user doesn't exist`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
