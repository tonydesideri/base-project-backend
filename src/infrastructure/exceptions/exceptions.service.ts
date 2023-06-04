import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { IException, IFormatExceptionMessage } from '../../domain/exceptions/exceptions.interface';
import { TooManyRequestsException } from '../common/exceptions/tooManyRequestes.exception';

@Injectable()
export class ExceptionsService implements IException {
  BadRequestException(data: IFormatExceptionMessage): void {
    throw new BadRequestException(data);
  }
  InternalServerErrorException(data?: IFormatExceptionMessage): void {
    throw new InternalServerErrorException(data);
  }
  ForbiddenException(data?: IFormatExceptionMessage): void {
    throw new ForbiddenException(data);
  }
  UnauthorizedException(data?: IFormatExceptionMessage): void {
    throw new UnauthorizedException(data);
  }
  TooManyRequestsException(message: string): void {
    throw new TooManyRequestsException(message);
  }
}
