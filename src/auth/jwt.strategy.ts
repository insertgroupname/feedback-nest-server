import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { jwtSecretConfig } from 'src/configs';

const extractJwtFromCookie = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
    console.log('token outside:' + token);
  }
  return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: '' + jwtSecretConfig().jwtSecret,
    });
  }

  extractJwtFromCookie(req) {
    let token = null;
    console.log('extract ');
    if (req && req.cookies) {
      token = req.cookies['jwt'];
      console.log('reqs' + token);
    }
    return token;
  }

  async validate(payload: any, done: VerifiedCallback) {
    const user = await this.authService.validateUser(payload);
    console.log('validating in jwt' + payload.userId);
    if (!user) {
      console.log('no found');
      throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
    }
    console.log(user);
    done(null, user);
    return { email: user.email };
  }
}
