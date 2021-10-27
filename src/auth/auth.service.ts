import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/user/dto/login-user.dto';
import { UserService } from '../user/user.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(payload: any): Promise<any> {
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
