import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateAuthDto } from './update-auth.dto';

describe('UpdateAuthDto', () => {
  it('passes with a valid refreshToken', async () => {
    const dto = plainToInstance(UpdateAuthDto, { refreshToken: 'some.jwt.token' });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects an empty refreshToken', async () => {
    const dto = plainToInstance(UpdateAuthDto, { refreshToken: '' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'refreshToken')).toBe(true);
  });

  it('rejects a missing refreshToken', async () => {
    const dto = plainToInstance(UpdateAuthDto, {});

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'refreshToken')).toBe(true);
  });
});
