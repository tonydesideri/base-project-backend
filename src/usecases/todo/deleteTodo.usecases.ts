import { ILoggerService } from 'src/domain/adapters/logger.interface'
import { ITodoRepository } from '../../domain/repositories/todoRepository.interface'

export class DeleteTodoUseCases {
  constructor(
    private readonly logger: ILoggerService,
    private readonly todoRepository: ITodoRepository,
  ) {}

  async execute(id: number): Promise<void> {
    await this.todoRepository.deleteById(id)
    this.logger.log(
      'deleteTodoUseCases execute',
      `Todo ${id} have been deleted`,
    )
  }
}
