import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { NotificationCreateDto } from './notification-create.dto';

describe('NotificationCreateDto', () => {
  it('passes with just a type', async () => {
    const dto = plainToInstance(NotificationCreateDto, { type: 'friend_request' });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('passes with a type and a payload object', async () => {
    const dto = plainToInstance(NotificationCreateDto, {
      type: 'friend_request',
      payload: { fromUserId: 'user-1' },
    });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects an empty type', async () => {
    const dto = plainToInstance(NotificationCreateDto, { type: '' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'type')).toBe(true);
  });

  it('rejects a missing type', async () => {
    const dto = plainToInstance(NotificationCreateDto, {});

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'type')).toBe(true);
  });

  it('rejects a non-object payload', async () => {
    const dto = plainToInstance(NotificationCreateDto, { type: 'friend_request', payload: 'not-an-object' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'payload')).toBe(true);
  });
});
