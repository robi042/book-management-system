import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  ConflictException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CONFLICT } from './responseHelper';

@Injectable()
export class ConflictExceptionFilter implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof ConflictException) {
          const response = context.switchToHttp().getResponse();
          const message = error.message || 'A conflict occurred';
          response.status(409).json(CONFLICT(message));
          return throwError(() => error);
        }
        return throwError(() => error);
      }),
    );
  }
}

