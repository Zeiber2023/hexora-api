import { ITaskRepository } from '../domain/task.repository';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new Error('Task not found');
    }

    if (String(task.userId) !== String(userId)) {
      throw new Error('Unauthorized to delete this task');
    }

    await this.taskRepository.delete(id);
  }
}