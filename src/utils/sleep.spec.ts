import { sleep } from './sleep';

describe('sleep', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('resolves after the given number of milliseconds', async () => {
    jest.useFakeTimers();

    const promise = sleep(1000);
    let resolved = false;
    void promise.then(() => {
      resolved = true;
    });

    await jest.advanceTimersByTimeAsync(999);
    expect(resolved).toBe(false);

    await jest.advanceTimersByTimeAsync(1);
    expect(resolved).toBe(true);
  });

  it('resolves with undefined', async () => {
    jest.useFakeTimers();

    const promise = sleep(0);
    await jest.advanceTimersByTimeAsync(0);

    await expect(promise).resolves.toBeUndefined();
  });
});
