// src/modules/tasks/application/dtos/create-task.dto.ts
import { TaskPriority } from '../../domain/task-priority';

export interface CreateTaskDTO {
  userId: string; // Proveniente del JWT después
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: Date;
}