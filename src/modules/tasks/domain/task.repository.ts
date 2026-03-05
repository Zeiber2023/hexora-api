import { TaskProps } from './task.entity';

export interface ITaskRepository {
  save(task: TaskProps): Promise<void>;
  findById(id: string): Promise<TaskProps | null>;
  findAllByUser(userId: string): Promise<TaskProps[]>; // Usaremos este como estándar
  update(task: TaskProps): Promise<void>;
  delete(id: string): Promise<void>;
}