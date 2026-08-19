import 'reflect-metadata';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { ExecutionContext } from '@nestjs/common';
import { CurrentUser, JwtPayload } from './current-user.decorator';

type ParamFactory = (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => unknown;

function getParamDecoratorFactory(decorator: (data?: keyof JwtPayload) => ParameterDecorator): ParamFactory {
  class TestClass {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public test(@decorator() _value: unknown): void {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestClass, 'test') as Record<string, { factory: ParamFactory }>;

  return Object.values(args)[0].factory;
}

function buildContext(user: JwtPayload | undefined): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe('CurrentUser decorator', () => {
  const factory = getParamDecoratorFactory(CurrentUser);
  const user: JwtPayload = { userId: 'user-1', username: 'bob', exp: 1234567890 };

  it('returns the full user when called without a key', () => {
    expect(factory(undefined, buildContext(user))).toEqual(user);
  });

  it('returns a single property when called with a key', () => {
    expect(factory('userId', buildContext(user))).toBe('user-1');
  });

  it('throws when there is no user on the request', () => {
    expect(() => factory(undefined, buildContext(undefined))).toThrow('User not found in request');
  });
});
