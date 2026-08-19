import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { InviteToRoomDto } from './invite-to-room.dto';

const VALID = { roomId: 'room-1', inviteeId: 'user-1' };

describe('InviteToRoomDto', () => {
  it('passes with valid roomId and inviteeId', async () => {
    const dto = plainToInstance(InviteToRoomDto, VALID);

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects an empty roomId', async () => {
    const dto = plainToInstance(InviteToRoomDto, { ...VALID, roomId: '' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'roomId')).toBe(true);
  });

  it('rejects an empty inviteeId', async () => {
    const dto = plainToInstance(InviteToRoomDto, { ...VALID, inviteeId: '' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'inviteeId')).toBe(true);
  });

  it('rejects a non-string inviteeId', async () => {
    const dto = plainToInstance(InviteToRoomDto, { ...VALID, inviteeId: 123 });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'inviteeId')).toBe(true);
  });
});
