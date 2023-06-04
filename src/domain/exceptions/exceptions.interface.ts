export interface IFormatExceptionMessage {
  message: string;
  code_error?: number;
}

export interface IException {
  BadRequestException(data: IFormatExceptionMessage): void;
  InternalServerErrorException(data?: IFormatExceptionMessage): void;
  ForbiddenException(data?: IFormatExceptionMessage): void;
  UnauthorizedException(data?: IFormatExceptionMessage): void;
  TooManyRequestsException(message: string): void;
}
