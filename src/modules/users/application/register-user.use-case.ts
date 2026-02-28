// src/modules/users/application/register-user.use-case.ts
import { User, IUserRepository, IPasswordHasher } from '../domain/index';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { v4 as uuidv4 } from 'uuid';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async execute(dto: RegisterUserDTO): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const user = new User({
      id: uuidv4(),
      email: dto.email,
      passwordHash: hashedPassword,
      createdAt: new Date(),
    });

    await this.userRepository.save(user);
  }
}