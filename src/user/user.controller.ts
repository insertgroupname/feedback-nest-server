import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import bcrypt from 'bcrypt';

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
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.findOne({ email: loginDto.email });
    if (
      user &&
      user.password &&
      (await bcrypt.compare(loginDto.password, user.password))
    ) {
      const token = await this.authService.signPayload(loginDto);
      delete loginDto.password;
      return { loginDto, token };
    }

    throw new HttpException(
      `invalid credential or user doesn't exist`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
