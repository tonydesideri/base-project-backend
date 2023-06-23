import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { authErrorMessages } from '../constants/auth.contant';

@Injectable()
export class JwtForgotPasswordGuard extends AuthGuard(
  'jwt-forgot-password-token'
) {
  handleRequest(err: any, user: any, info: any, context: any) {
    if (err || !user) {
      throw new UnauthorizedException(
        authErrorMessages.TOKEN_INVALID_OR_EXPIRED_FORGOT_PASSWORD
      );
    }
    return user;
  }
}
