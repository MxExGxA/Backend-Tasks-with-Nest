import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();
    const status = exception.code;
    const error = exception.name;
    const message = status === 'P2002' ? 'This Book is already exist' : 'Database error';

    response
      .status(status === 'P2002' ? HttpStatus.CONFLICT : HttpStatus.INTERNAL_SERVER_ERROR)
      .json({
        status,
        error,
        message,
      });
  }
}
