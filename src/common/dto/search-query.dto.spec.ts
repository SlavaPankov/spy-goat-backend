import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SearchQueryDto } from './search-query.dto';

describe('SearchQueryDto', () => {
  it('inherits pagination defaults from QueryDto', () => {
    const dto = plainToInstance(SearchQueryDto, {});

    expect(dto.limit).toBe(20);
    expect(dto.offset).toBe(0);
  });

  it('accepts an optional search string', async () => {
    const dto = plainToInstance(SearchQueryDto, { search: 'bob' });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects a non-string search value', async () => {
    const dto = plainToInstance(SearchQueryDto, { search: 123 });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'search')).toBe(true);
  });
});
