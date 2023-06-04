import { Module } from '@nestjs/common'
import { ExceptionsService } from '../exceptions/exceptions.service'
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module'
import { AuthController } from './auth/auth.controller'
import { TodoController } from './todo/todo.controller'
import { UserController } from './user/user.controller'

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [TodoController, AuthController, UserController],
  providers: [ExceptionsService], // Verificar se essa é a melhor opção e descobrir porque preciso importar aqui
})
export class ControllersModule {}
