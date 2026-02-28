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

app.post('/api/auth/register', (req, res) => userController.register(req, res));
app.post('/api/auth/login', (req, res) => userController.login(req, res));
app.use('/api/tasks', createAuthMiddleware(tokenService)); // Middleware de autenticación para rutas de tareas


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