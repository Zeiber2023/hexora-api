import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../../modules/users/domain/token-service';

// Exportamos una función que genera el middleware con el servicio inyectado
export const createAuthMiddleware = (tokenService: ITokenService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Usamos el servicio que viene por parámetro
      const decoded = tokenService.verify(token);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      console.error('JWT Verify Error:', error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
};