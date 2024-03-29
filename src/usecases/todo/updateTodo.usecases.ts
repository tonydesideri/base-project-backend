import { ILoggerService } from 'src/domain/adapters/logger.interface';
import { ITodoRepository } from '../../domain/repositories/todoRepository.interface';

export class UpdateTodoUseCases {
  constructor(
    private readonly logger: ILoggerService,
    private readonly todoRepository: ITodoRepository
  ) {}

  async execute(id: number, isDone: boolean): Promise<void> {
    await this.todoRepository.updateContent(id, isDone);
    this.logger.log(
      'updateTodoUseCases execute',
      `Todo ${id} have been updated`
    );
  }
}
