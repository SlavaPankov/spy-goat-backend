import JwtAuthGuard from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

type ReflectorMock = { getAllAndOverride: jest.Mock };

const buildContext = () =>
  ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
  }) as unknown as ExecutionContext;

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: ReflectorMock;
  let superCanActivateSpy: jest.SpyInstance;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() };
    guard = new JwtAuthGuard(reflector as unknown as Reflector);

    const authGuardProto = Object.getPrototypeOf(JwtAuthGuard.prototype) as {
      canActivate: (...args: unknown[]) => unknown;
    };
    superCanActivateSpy = jest.spyOn(authGuardProto, 'canActivate').mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('bypasses JWT verification when the route is marked public', () => {
    reflector.getAllAndOverride.mockReturnValue(true);
    const context = buildContext();

    const result = guard.canActivate(context);

    expect(result).toBe(true);
    expect(superCanActivateSpy).not.toHaveBeenCalled();
  });

  it('delegates to the passport JWT strategy when the route is not public', () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const context = buildContext();

    guard.canActivate(context);

    expect(superCanActivateSpy).toHaveBeenCalledWith(context);
  });

  it('checks both the handler and the class for the isPublic metadata', () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const context = buildContext();

    guard.canActivate(context);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [context.getHandler(), context.getClass()]);
  });
});
