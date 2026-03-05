import { Pool } from 'pg';
import { TaskProps } from '../../domain/task.entity';
import { ITaskRepository } from '../../domain/task.repository';

export class PostgresTaskRepository implements ITaskRepository {
  constructor(private readonly pool: Pool) {}

  async save(task: TaskProps): Promise<void> {
    const query = `
      INSERT INTO tasks (id, user_id, title, description, status, priority, due_date, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    const values = [
      task.id, task.userId, task.title, task.description, 
      task.status, task.priority, task.dueDate, task.createdAt, task.updatedAt
    ];
    await this.pool.query(query, values);
  }

  async findById(id: string): Promise<any> {
    const result = await this.pool.query(
      'SELECT id, user_id, title, description, status, priority, due_date, created_at, updated_at FROM tasks WHERE id = $1',
      [id]
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      dueDate: row.due_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async update(task: TaskProps): Promise<void> {
    const query = `
      UPDATE tasks SET status = $1, updated_at = $2
      WHERE id = $3
    `;
    await this.pool.query(query, [task.status, task.updatedAt, task.id]);
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  }

  async findAllByUser(userId: string): Promise<TaskProps[]> {
    const result = await this.pool.query(
      'SELECT id, user_id as "userId", title, description, status, priority, due_date as "dueDate", created_at as "createdAt", updated_at as "updatedAt" FROM tasks WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  }
}