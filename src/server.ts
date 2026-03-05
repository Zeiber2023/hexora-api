import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { logger } from './shared/logger';
import { PostgresUserRepository } from './modules/users/infrastructure/persistence/postgres-user.repository';
import { BcryptPasswordHasher } from './modules/users/infrastructure/security/bcrypt-password-hasher';
import { JwtTokenService } from './modules/users/infrastructure/security/jwt-token.service';
import { RegisterUserUseCase } from './modules/users/application/register-user.use-case';
import { LoginUserUseCase } from './modules/users/application/login-user.use-case';
import { UserController } from './modules/users/interfaces/http/user.controller';
import { createAuthMiddleware } from './shared/infrastructure/http/auth.middleware';
import { PostgresTaskRepository } from './modules/tasks/infrastructure/persistence/postgres-task.repository';
import { CreateTaskUseCase } from './modules/tasks/application/create-task.use-case';
import { TaskController } from './modules/tasks/interfaces/http/task.controller';
import { GetTasksByUserUseCase } from './modules/tasks/application/get-tasks-by-user.use-case';
import { UpdateTaskStatusUseCase } from './modules/tasks/application/update-task-status.use-case';
import { DeleteTaskUseCase } from './modules/tasks/application/delete-task.use-case';

dotenv.config();

const app = express();
app.use(express.json());

const dbPool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
});

const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();
const userRepository = new PostgresUserRepository(dbPool);

const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);
const userController = new UserController(registerUserUseCase, loginUserUseCase);

const taskRepository = new PostgresTaskRepository(dbPool);
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const getTasksByUserUseCase = new GetTasksByUserUseCase(taskRepository);
const updateTaskStatusUseCase = new UpdateTaskStatusUseCase(taskRepository); 
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

const taskController = new TaskController(
    createTaskUseCase,
    getTasksByUserUseCase,
    updateTaskStatusUseCase,
    deleteTaskUseCase
);

app.post('/api/auth/register', (req, res) => userController.register(req, res));
app.post('/api/auth/login', (req, res) => userController.login(req, res));
app.use('/api/tasks', createAuthMiddleware(tokenService));
app.post('/api/tasks', (req, res) => taskController.create(req, res));
app.get('/api/tasks', (req, res) => taskController.getAll(req, res));
app.patch('/api/tasks/:id/status', (req, res) => taskController.updateStatus(req, res));
app.delete('/api/tasks/:id', (req, res) => taskController.delete(req, res));

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await dbPool.query('SELECT 1');
        logger.info('Database connected successfully');

        app.listen(PORT, () => {
            logger.info(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        logger.error(error as Error, '❌ Failed to start server');
        process.exit(1);
    }
}

startServer();