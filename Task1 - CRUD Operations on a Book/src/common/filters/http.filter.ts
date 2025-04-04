import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    const message = exception.getResponse()['message'] || exception.message;

    response.status(status).json({ statusCode: status, message, error: exception.name });
  }
}
