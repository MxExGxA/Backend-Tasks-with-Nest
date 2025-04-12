import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromRequest(req);

    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token);
        req['user'] = payload;
      } catch (error) {
        req['user'] = null;
      }
    }
    next();
  }

  extractTokenFromRequest(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') || [];
    return type === 'Bearer' ? token : undefined;
  }
}
