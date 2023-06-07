import { TodoM } from '../../domain/model/todo'
import { ITodoRepository } from '../../domain/repositories/todoRepository.interface'

export class GetTodosUseCases {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(): Promise<TodoM[]> {
    return await this.todoRepository.findAll()
  }
}
