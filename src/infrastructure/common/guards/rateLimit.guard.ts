import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request, Response } from 'express'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service'

@Injectable()
export class RateLimitGuard implements CanActivate {
  private rateLimiter: RateLimiterMemory

  constructor(private readonly exceptionService: ExceptionsService) {
    this.rateLimiter = new RateLimiterMemory({
      points: 10, // número máximo de tentativas de login permitidas
      duration: 120, // período de tempo para a contagem em segundos
    })
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()

    const ipAddress = request.ip
    const key = `rate-limiter:${ipAddress}`
    console.log(response.statusCode)
    try {
      await this.rateLimiter.consume(key)
      return true // continua com a execução da rota
    } catch (rateLimiterRes) {
      if (response.statusCode !== 401) {
        // Se o status da resposta não for 401, retorna true para permitir a execução da rota
        return true
      }
      // Limite de taxa excedido, ação necessária (exemplo: retornar erro, bloquear conta, etc.)
      this.exceptionService.TooManyRequestsException(
        'Rate limit exceeded. Please try again later.',
      )
    }
  }
}
