import { ForbiddenException } from '@nestjs/common';
import { UserLoginStrategy } from './user-login.strategy';
import { AuthService } from '../auth.service';

type AuthServiceMock = { verifyUserCredentials: jest.Mock };

describe('UserLoginStrategy', () => {
  let strategy: UserLoginStrategy;
  let authService: AuthServiceMock;

  beforeEach(() => {
    authService = { verifyUserCredentials: jest.fn() };
    strategy = new UserLoginStrategy(authService as unknown as AuthService);
  });

  it('throws when the credentials do not match a user', async () => {
    authService.verifyUserCredentials.mockResolvedValue(null);

    await expect(strategy.validate('alice', 'wrong-password')).rejects.toThrow(ForbiddenException);
  });

  it('returns the user when the credentials are valid', async () => {
    const user = { id: 'user-1', username: 'alice' };
    authService.verifyUserCredentials.mockResolvedValue(user);

    const result = await strategy.validate('alice', 'correct-password');

    expect(authService.verifyUserCredentials).toHaveBeenCalledWith({ username: 'alice', password: 'correct-password' });
    expect(result).toBe(user);
  });
});
