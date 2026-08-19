import { timeStamp } from './timeStamp';

describe('timeStamp', () => {
  it('returns a string in "DD-MM-YYYY HH-mm-ss" format', () => {
    expect(timeStamp()).toMatch(/^\d{2}-\d{2}-\d{4} \d{2}-\d{2}-\d{2}$/);
  });

  it('uses a fixed, known date to build the expected string', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-03-05T14:07:09'));

    expect(timeStamp()).toBe('05-03-2026 14-07-09');

    jest.useRealTimers();
  });
});
