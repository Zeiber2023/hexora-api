import { ITaskRepository } from '../domain/task.repository';
import { Task, TaskStatus, TaskPriority } from '../domain/index'; // Usando tu clase
import { v4 as uuidv4 } from 'uuid';

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(dto: any): Promise<any> {
    const now = new Date();
    
    // Creamos la instancia de la Clase de Dominio
    const task = new Task({
      id: uuidv4(),
      userId: dto.userId,
      title: dto.title,
      description: dto.description || '',
      status: TaskStatus.PENDING,
      priority: dto.priority || TaskPriority.MEDIUM,
      dueDate: dto.dueDate || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // +7 días default
      createdAt: now,
      updatedAt: now
    });

    // Pasamos los datos planos al repositorio
    await this.taskRepository.save(task.toPrimitives());
    
    return task.toPrimitives();
  }
}