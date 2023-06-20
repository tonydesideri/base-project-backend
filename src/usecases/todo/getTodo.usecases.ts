import { TodoM } from '../../domain/model/todo';
import { ITodoRepository } from '../../domain/repositories/todoRepository.interface';

export class GetTodoUseCases {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(id: number): Promise<TodoM> {
    return await this.todoRepository.findById(id);
  }
}
