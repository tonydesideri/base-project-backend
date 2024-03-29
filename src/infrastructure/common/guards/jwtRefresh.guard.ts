import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { authErrorMessages } from '../constants/auth.contant';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  handleRequest(err: any, user: any, info: any, context: any) {
    if (err || !user) {
      throw new ForbiddenException(authErrorMessages.TOKEN_INVALID_OR_EXPIRED);
    }
    return user;
  }
}
