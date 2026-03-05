import { ITaskRepository } from '../domain/task.repository';
import { TaskProps } from '../domain/task.entity';

export class GetTasksByUserUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(userId: string): Promise<TaskProps[]> {
    
    return await this.taskRepository.findAllByUser(userId);
  }
}