import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  handleRequest(err: any, user: any, info: any, context: any) {
    if (err || !user) {
      throw new ForbiddenException();
    }
    return user;
  }
}
