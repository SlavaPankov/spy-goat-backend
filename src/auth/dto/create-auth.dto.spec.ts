import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateAuthDto } from './create-auth.dto';

const VALID = { login: 'bob', password: 'secret123' };

describe('CreateAuthDto', () => {
  it('passes with a valid login and password', async () => {
    const dto = plainToInstance(CreateAuthDto, VALID);

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects an empty login', async () => {
    const dto = plainToInstance(CreateAuthDto, { ...VALID, login: '' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'login')).toBe(true);
  });

  it('rejects an empty password', async () => {
    const dto = plainToInstance(CreateAuthDto, { ...VALID, password: '' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('rejects a missing password', async () => {
    const { password: _password, ...rest } = VALID;
    const dto = plainToInstance(CreateAuthDto, rest);

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('rejects a non-string password', async () => {
    const dto = plainToInstance(CreateAuthDto, { ...VALID, password: 12345678 });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });
});
