import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    // Handle Sequelize validation errors
    if ((exception as any)?.name === 'SequelizeValidationError') {
      status = HttpStatus.BAD_REQUEST;
      error = 'Validation Error';
      const validationErrors = (exception as any)?.errors || [];
      if (validationErrors.length > 0) {
        message = validationErrors.map((err: any) => err.message).join(', ');
      }
    }
    // Handle Sequelize unique constraint errors
    else if ((exception as any)?.name === 'SequelizeUniqueConstraintError') {
      status = HttpStatus.CONFLICT;
      error = 'Conflict';
      message = 'A record with this value already exists';
    }
    // Handle Conflict exceptions
    else if (exception instanceof ConflictException) {
      status = HttpStatus.CONFLICT;
      error = 'Conflict';
      const exceptionResponse = (exception as HttpException).getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        if (Array.isArray(responseObj.message)) {
          message = responseObj.message.join(', ');
        } else {
          message = responseObj.message || message;
        }
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    }
    // Handle HTTP exceptions
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        if (Array.isArray(responseObj.message)) {
          message = responseObj.message.join(', ');
        } else {
          message = responseObj.message || message;
        }
        error = responseObj.error || error;
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    } 
    // Handle other errors
    else if (exception instanceof Error) {
      message = exception.message;
    }

    // Try to log via winston if available
    try {
      // dynamic import to avoid hard dependency
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { winstonLog } = require('../config/winstonLog');
      const logPayload = {
        statusCode: status,
        path: request.url,
        message,
        error,
      };
      if (status >= 500) {
        winstonLog.error('HTTP %d %s - %s', status, request.url, message, logPayload);
      } else {
        winstonLog.warn('HTTP %d %s - %s', status, request.url, message, logPayload);
      }
    } catch {}

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error,
    });
  }
}

