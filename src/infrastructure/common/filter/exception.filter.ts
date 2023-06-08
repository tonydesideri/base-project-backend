import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { LoggerService } from '../../services/logger/logger.service'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error'

    const errors =
      exception instanceof HttpException
        ? this.extractValidationErrors(exception.getResponse())
        : null

    const responseData = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errors || [message],
    }

    this.logMessage(request, message, status, exception)

    response.status(status).json(responseData)
  }

  private logMessage(
    request: any,
    message: string,
    status: number,
    exception: any,
  ) {
    if (status >= 500) {
      this.logger.error(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} message=${message || null}`,
        status >= 500 ? exception.stack : '',
      )
    } else {
      this.logger.warn(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} message=${message || null}`,
      )
    }
  }

  private extractValidationErrors(response: any): string[] {
    const validationErrors: string[] = []
    const errorObject = response.message

    if (Array.isArray(errorObject)) {
      errorObject.forEach((errorMessage: string) => {
        validationErrors.push(errorMessage)
      })
    } else {
      validationErrors.push(errorObject)
    }

    return validationErrors
  }
}
