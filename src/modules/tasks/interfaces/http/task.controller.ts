import { Request, Response } from 'express';
import { CreateTaskUseCase } from '../../application/create-task.use-case';
import { GetTasksByUserUseCase } from '../../application/get-tasks-by-user.use-case';
import { UpdateTaskStatusUseCase } from '../../application/update-task-status.use-case';
import { TaskStatus } from '../../domain/task-status';
import { DeleteTaskUseCase } from '../../application/delete-task.use-case';

export class TaskController {
    constructor(private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTasksByUserUseCase: GetTasksByUserUseCase,
    private readonly updateTaskStatusUseCase: UpdateTaskStatusUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase) { }


    async create(req: Request, res: Response) {
        try {
            const { title, description, priority, dueDate } = req.body;
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({ error: 'User ID not found in request context' });
            }

            const task = await this.createTaskUseCase.execute({
                userId,
                title,
                description,
                priority,
                dueDate
            });

            return res.status(201).json(task);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            const tasks = await this.getTasksByUserUseCase.execute(userId);
            return res.status(200).json(tasks);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }


    async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const userId = req.userId;

            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            await this.updateTaskStatusUseCase.execute(id as string, userId, status as TaskStatus);

            return res.status(200).json({ message: 'Task status updated successfully' });
        } catch (error: any) {
            const statusCode = error.message === 'Task not found' ? 404 : 403;
            return res.status(statusCode).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            await this.deleteTaskUseCase.execute(id as string, userId);

            return res.status(204).send();
        } catch (error: any) {
            const statusCode = error.message === 'Task not found' ? 404 : 403;
            return res.status(statusCode).json({ error: error.message });
        }
    }

}
