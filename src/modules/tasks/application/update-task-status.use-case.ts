import { ITaskRepository } from '../domain/task.repository';
import { TaskStatus } from '../domain/task-status';

export class UpdateTaskStatusUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string, userId: string, newStatus: TaskStatus): Promise<void> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.userId !== userId) {
      throw new Error('Unauthorized to update this task');
    }

    const updatedTask = {
      ...task,
      status: newStatus,
      updatedAt: new Date()
    };

    await this.taskRepository.update(updatedTask);
  }
}