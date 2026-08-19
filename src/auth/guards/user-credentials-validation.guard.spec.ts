import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { UserCredentialsValidationGuard } from './user-credentials-validation.guard';

const buildContext = (body: unknown): ExecutionContext =>
  ({
    switchToHttp: () => ({ getRequest: () => ({ body }) }),
  }) as unknown as ExecutionContext;

describe('UserCredentialsValidationGuard', () => {
  let guard: UserCredentialsValidationGuard;

  beforeEach(() => {
    guard = new UserCredentialsValidationGuard();
  });

  it('throws when username is missing', () => {
    expect(() => guard.canActivate(buildContext({ password: 'pw' }))).toThrow(BadRequestException);
  });

  it('throws when password is missing', () => {
    expect(() => guard.canActivate(buildContext({ username: 'alice' }))).toThrow(BadRequestException);
  });

  it('throws when username is not a string', () => {
    expect(() => guard.canActivate(buildContext({ username: 123, password: 'pw' }))).toThrow(BadRequestException);
  });

  it('throws when password is not a string', () => {
    expect(() => guard.canActivate(buildContext({ username: 'alice', password: 123 }))).toThrow(BadRequestException);
  });

  it('allows the request through when both fields are valid strings', () => {
    expect(guard.canActivate(buildContext({ username: 'alice', password: 'pw' }))).toBe(true);
  });
});
