import { ILoggerService } from 'src/domain/adapters/logger.interface';
import { TodoM } from '../../domain/model/todo';
import { ITodoRepository } from '../../domain/repositories/todoRepository.interface';

export class AddTodoUseCases {
  constructor(
    private readonly logger: ILoggerService,
    private readonly todoRepository: ITodoRepository
  ) {}

  async execute(content: string): Promise<TodoM> {
    const todo = new TodoM();
    todo.content = content;
    todo.isDone = false;
    const result = await this.todoRepository.insert(todo);
    this.logger.log('addTodoUseCases execute', 'New todo have been inserted');
    return result;
  }
}
