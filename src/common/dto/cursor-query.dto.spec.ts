import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CursorQueryDto } from './cursor-query.dto';

describe('CursorQueryDto', () => {
  it('allows both fields to be omitted', async () => {
    const dto = plainToInstance(CursorQueryDto, {});

    expect(await validate(dto)).toHaveLength(0);
  });

  it('coerces a string limit into a number', () => {
    const dto = plainToInstance(CursorQueryDto, { limit: '15' });

    expect(dto.limit).toBe(15);
  });

  it('rejects a non-integer limit', async () => {
    const dto = plainToInstance(CursorQueryDto, { limit: '3.5' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'limit')).toBe(true);
  });
});
