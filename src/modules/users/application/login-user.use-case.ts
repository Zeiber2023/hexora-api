import { IUserRepository, IPasswordHasher, ITokenService } from '../domain/index';

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}

  async execute(dto: any) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new Error('Invalid credentials');

    const isPasswordValid = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    const token = this.tokenService.generate({ userId: user.id });
    return { token };
  }
}