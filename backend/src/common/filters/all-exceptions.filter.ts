import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let stack: string | undefined;
    let query: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || exception.message;
      stack = exception.stack;
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      stack = exception.stack;
      query = (exception as any).query;
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    const errorResponse: any = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    };

    if (stack) {
      errorResponse.stack = stack;
    }

    if (query) {
      errorResponse.query = query;
    }

    response.status(status).json(errorResponse);
  }
}
