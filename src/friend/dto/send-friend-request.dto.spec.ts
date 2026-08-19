import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SendFriendRequestDto } from './send-friend-request.dto';

describe('SendFriendRequestDto', () => {
  it('passes with a valid addresseeId', async () => {
    const dto = plainToInstance(SendFriendRequestDto, { addresseeId: 'user-1' });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects an empty addresseeId', async () => {
    const dto = plainToInstance(SendFriendRequestDto, { addresseeId: '' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'addresseeId')).toBe(true);
  });

  it('rejects a missing addresseeId', async () => {
    const dto = plainToInstance(SendFriendRequestDto, {});

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'addresseeId')).toBe(true);
  });

  it('rejects a non-string addresseeId', async () => {
    const dto = plainToInstance(SendFriendRequestDto, { addresseeId: 42 });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'addresseeId')).toBe(true);
  });
});
