import { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { ExcludePasswordInterceptor } from './exclude-password.interceptor';

describe('ExcludePasswordInterceptor', () => {
  let interceptor: ExcludePasswordInterceptor;

  const buildNext = (data: unknown): CallHandler => ({
    handle: () => of(data),
  });

  const context = {} as ExecutionContext;

  beforeEach(() => {
    interceptor = new ExcludePasswordInterceptor();
  });

  it('strips password from a plain object', async () => {
    const result = await lastValueFrom(
      interceptor.intercept(context, buildNext({ id: '1', username: 'bob', password: 'secret' }))
    );

    expect(result).toEqual({ id: '1', username: 'bob' });
  });

  it('strips password from every item in an array', async () => {
    const result = await lastValueFrom(
      interceptor.intercept(
        context,
        buildNext([
          { id: '1', password: 'a' },
          { id: '2', password: 'b' },
        ])
      )
    );

    expect(result).toEqual([{ id: '1' }, { id: '2' }]);
  });

  it('strips password from nested objects', async () => {
    const result = await lastValueFrom(
      interceptor.intercept(
        context,
        buildNext({ id: '1', password: 'secret', profile: { name: 'bob', password: 'nested-secret' } })
      )
    );

    expect(result).toEqual({ id: '1', profile: { name: 'bob' } });
  });

  it('leaves an object without a password field unchanged', async () => {
    const result = await lastValueFrom(interceptor.intercept(context, buildNext({ id: '1', username: 'bob' })));

    expect(result).toEqual({ id: '1', username: 'bob' });
  });

  it('passes through null and undefined unchanged', async () => {
    expect(await lastValueFrom(interceptor.intercept(context, buildNext(null)))).toBeNull();
    expect(await lastValueFrom(interceptor.intercept(context, buildNext(undefined)))).toBeUndefined();
  });

  it('passes through primitive values unchanged', async () => {
    expect(await lastValueFrom(interceptor.intercept(context, buildNext('just a string')))).toBe('just a string');
    expect(await lastValueFrom(interceptor.intercept(context, buildNext(42)))).toBe(42);
  });
});
