import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const token = extractTokenFromRequest(request);
    if (!token) throw new BadRequestException('No Token Provided!');

    try {
      const payload = await this.jwtService.verifyAsync(token as string);
      request['user'] = payload;
    } catch (error) {
      request['user'] = null;
    }

    next();
    //extracts token from user request
    function extractTokenFromRequest(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') || [];
      return type === 'Bearer' ? token : undefined;
    }
  }
}
