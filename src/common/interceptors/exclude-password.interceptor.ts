import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

type PlainObject = Record<string, unknown>;

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data: unknown) => this.excludePassword(data)));
  }

  private excludePassword(data: unknown): unknown {
    if (!data) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item: unknown) => this.excludePassword(item));
    }

    if (typeof data === 'object') {
      const obj = data as PlainObject;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = obj;

      const result: PlainObject = {};

      Object.keys(rest).forEach((key) => {
        result[key] = this.excludePassword(rest[key]);
      });

      return result;
    }

    return data;
  }
}
