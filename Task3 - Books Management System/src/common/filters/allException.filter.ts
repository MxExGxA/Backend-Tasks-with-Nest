import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();
    const timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      const error = exception.getResponse();
      return response.status(response.statusCode).json({ timestamp, error });
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      const code = exception.code;
      let statusCode: number = 500;
      let message: string = exception.name;

      switch (code) {
        //database unreachable
        case 'P1001':
          message = 'the database server is unreachable';

        //unique constraint failed
        case 'P2002':
          message = 'unique constraint failed (Duplicate entry)';
          statusCode = 409;
      }

      return response.status(statusCode).json({ timestamp, error: message, code });
    }

    response.status(500).json({ timestamp, error: 'Internal Server Error', statusCode: 500 });
  }
}
