import jwt from 'jsonwebtoken';
import { ITokenService } from '../../domain/token-service';

export class JwtTokenService implements ITokenService {
  private readonly secret = process.env.JWT_SECRET || 'secret';

  generate(payload: { userId: string }): string {
    return jwt.sign(payload, this.secret, { expiresIn: '1d' });
  }

  verify(token: string): any {
    return jwt.verify(token, this.secret);
  }
}