import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/register-user.use-case';
import { LoginUserUseCase } from '../../application/login-user.use-case';

export class UserController {
    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase,
        private readonly loginUserUseCase: LoginUserUseCase // <--- Inyectamos el login
    ) {}

    async register(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            await this.registerUserUseCase.execute({ email, password });
            return res.status(201).json({ message: 'User registered successfully' });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await this.loginUserUseCase.execute({ email, password });
            return res.status(200).json(result); // Devuelve { token }
        } catch (error: any) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    }
}