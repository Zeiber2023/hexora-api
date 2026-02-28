// src/modules/tasks/domain/task.entity.ts
import { TaskStatus, TaskPriority } from './index'; 

export interface TaskProps {
  id: string;
  userId: string; // Tenant identifier
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Task {
  private props: TaskProps;

  constructor(props: TaskProps) {
    this.validate(props);
    this.props = props;
  }

  // Lógica de negocio: Validación simple de dominio
  private validate(props: TaskProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Task title cannot be empty');
    }
    // Aquí podrías añadir validaciones de fechas o de integridad
  }

  // Getters para mantener la inmutabilidad controlada
  get id() { return this.props.id; }
  get userId() { return this.props.userId; }
  get title() { return this.props.title; }
  get description() { return this.props.description; }
  get status() { return this.props.status; }
  get priority() { return this.props.priority; }
  get dueDate() { return this.props.dueDate; }

  // Métodos de negocio (Domain Actions)
  public complete() {
    this.props.status = TaskStatus.COMPLETED;
    this.props.updatedAt = new Date();
  }

  public updateDescription(newDescription: string) {
    this.props.description = newDescription;
    this.props.updatedAt = new Date();
  }

  // Método para exportar datos planos (útil para la capa de infraestructura)
  public toPrimitives(): TaskProps {
    return { ...this.props };
  }
}