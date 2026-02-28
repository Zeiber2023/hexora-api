// src/modules/users/infrastructure/persistence/postgres-user.repository.ts
import { IUserRepository } from '../../domain/user.repository';
import { User } from '../../domain/user.entity';
import { Pool } from 'pg'; // Usando el driver nativo o un query builder

export class PostgresUserRepository implements IUserRepository {
  constructor(private readonly db: Pool) {}

  async save(user: User): Promise<void> {
    const { id, email, passwordHash, createdAt } = user.toPrimitives();
    
    const query = `
      INSERT INTO users (id, email, password_hash, created_at)
      VALUES ($1, $2, $3, $4)
    `;
    
    await this.db.query(query, [id, email, passwordHash, createdAt]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const res = await this.db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (res.rows.length === 0) return null;

    const row = res.rows[0];
    return new User({
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      createdAt: row.created_at
    });
  }

  async findById(id: string): Promise<User | null> {
    // Implementación similar...
    return null; 
  }
}