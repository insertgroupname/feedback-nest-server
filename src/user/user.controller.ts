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
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/v2/login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.findOne({ email: loginDto.email });
    if (
      user &&
      user.password &&
      (await bcrypt.compare(loginDto.password, user.password))
    ) {
      return this.authService.login(loginDto);
    }

    throw new HttpException(
      `invalid credential or user doesn't exist`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
