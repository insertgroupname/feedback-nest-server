import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import bcrypt from 'bcrypt';
import { ExpressAdapter } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/v2/register')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.findOne({
      email: createUserDto.email,
    });
    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }
    const token = await this.authService.signPayload(createUserDto);
    delete createUserDto.password;
    return { createUserDto, token };
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
      delete user.password;
      res.cookie('jwt', token, { maxAge: 86400000 });

      return user;
    }

    throw new HttpException(
      `invalid credential or user doesn't exist`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
