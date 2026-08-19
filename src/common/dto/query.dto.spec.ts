import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { QueryDto } from './query.dto';

describe('QueryDto', () => {
  it('defaults limit to 20 and offset to 0 when omitted', () => {
    const dto = plainToInstance(QueryDto, {});

    expect(dto.limit).toBe(20);
    expect(dto.offset).toBe(0);
  });

  it('coerces string query values into numbers', () => {
    const dto = plainToInstance(QueryDto, { limit: '10', offset: '5' });

    expect(dto.limit).toBe(10);
    expect(dto.offset).toBe(5);
    expect(typeof dto.limit).toBe('number');
  });

  it('rejects a limit above 50', async () => {
    const dto = plainToInstance(QueryDto, { limit: '100' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'limit')).toBe(true);
  });

  it('rejects a limit below 1', async () => {
    const dto = plainToInstance(QueryDto, { limit: '0' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'limit')).toBe(true);
  });

  it('rejects a negative offset', async () => {
    const dto = plainToInstance(QueryDto, { offset: '-1' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'offset')).toBe(true);
  });

  it('rejects a non-numeric limit', async () => {
    const dto = plainToInstance(QueryDto, { limit: 'abc' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'limit')).toBe(true);
  });
});
