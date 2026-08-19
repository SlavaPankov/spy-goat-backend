import { plainToInstance } from 'class-transformer';
import { IsoDate } from './iso-date.decorator';

class TestDto {
  @IsoDate()
  date: Date | string | null;
}

describe('IsoDate', () => {
  it('converts a Date instance to an ISO string', () => {
    const result = plainToInstance(TestDto, { date: new Date('2024-01-01T12:00:00.000Z') });

    expect(result.date).toBe('2024-01-01T12:00:00.000Z');
  });

  it('leaves an already-string value untouched', () => {
    const result = plainToInstance(TestDto, { date: '2024-01-01T12:00:00.000Z' });

    expect(result.date).toBe('2024-01-01T12:00:00.000Z');
  });

  it('passes through null without throwing', () => {
    const result = plainToInstance(TestDto, { date: null });

    expect(result.date).toBeNull();
  });
});
