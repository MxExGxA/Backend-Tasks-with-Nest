import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();

    //handles http exception
    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
    }
    //handles prisma exceptions
    else if (exception instanceof PrismaClientKnownRequestError) {
      const code = exception.code;
      const message = exception.name;
      response.status(400).json({ message, code });
    }
    //handles all other exceptions
    else {
      response.status(500).json({ message: 'Internal Server Error', status: 500 });
    }
  }
}
