import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

const VALID = { username: 'alice', password: 'password123', confirmPassword: 'password123' };

describe('CreateUserDto', () => {
  it('passes with only the required fields', async () => {
    const dto = plainToInstance(CreateUserDto, VALID);

    expect(await validate(dto)).toHaveLength(0);
  });

  it('fails when username is missing', async () => {
    const dto = plainToInstance(CreateUserDto, { ...VALID, username: undefined });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'username')).toBe(true);
  });

  it('fails when password is missing', async () => {
    const dto = plainToInstance(CreateUserDto, { ...VALID, password: undefined });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('fails when confirmPassword does not match', async () => {
    const dto = plainToInstance(CreateUserDto, { ...VALID, confirmPassword: 'nope' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'confirmPassword')).toBe(true);
  });

  it('fails when email is present but malformed', async () => {
    const dto = plainToInstance(CreateUserDto, { ...VALID, email: 'not-an-email' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'email')).toBe(true);
  });

  it('passes with a valid email', async () => {
    const dto = plainToInstance(CreateUserDto, { ...VALID, email: 'alice@example.com' });

    expect(await validate(dto)).toHaveLength(0);
  });
});
