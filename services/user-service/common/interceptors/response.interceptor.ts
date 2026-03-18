import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    return next.handle().pipe(
      map((data) => this.transformResponse(data))
    );
  }

  private transformResponse(data: any) {

    if (!data) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitize(item));
    }

    return this.sanitize(data);
  }

  private sanitize(data: any) {

    if (typeof data !== 'object') return data;

    const {
      password,
      deletedAt,
      ...safeData
    } = data;

    return safeData;
  }
}