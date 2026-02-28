import { Pool } from 'pg';
import { TaskProps } from '../../domain/task.entity';
import { ITaskRepository } from '../../domain/task.repository';

export class PostgresTaskRepository implements ITaskRepository {
  constructor(private readonly db: Pool) {}

  async save(task: TaskProps): Promise<void> {
    const query = `
      INSERT INTO tasks (id, user_id, title, description, status, priority, due_date, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    const values = [
      task.id, task.userId, task.title, task.description, 
      task.status, task.priority, task.dueDate, task.createdAt, task.updatedAt
    ];
    await this.db.query(query, values);
  }

  async findById(id: string): Promise<TaskProps | null> {
    const res = await this.db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async findAllByUser(userId: string): Promise<TaskProps[]> {
    const res = await this.db.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', 
      [userId]
    );
    return res.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      dueDate: row.due_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  async update(task: TaskProps): Promise<void> {
    const query = `
      UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, updated_at = $5
      WHERE id = $6 AND user_id = $7
    `;
    await this.db.query(query, [
      task.title, task.description, task.status, task.priority, new Date(), task.id, task.userId
    ]);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.db.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
  }
}