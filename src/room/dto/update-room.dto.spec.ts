import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateRoomDto } from './update-room.dto';

const VALID = { name: 'Room One', maxPlayers: 4, withBots: true };

describe('UpdateRoomDto', () => {
  it('passes with all valid fields', async () => {
    const dto = plainToInstance(UpdateRoomDto, VALID);

    expect(await validate(dto)).toHaveLength(0);
  });

  it('allows withBots to be omitted', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { withBots: _withBots, ...rest } = VALID;
    const dto = plainToInstance(UpdateRoomDto, rest);

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects a name shorter than 3 characters', async () => {
    const dto = plainToInstance(UpdateRoomDto, { ...VALID, name: 'ab' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('rejects an empty name', async () => {
    const dto = plainToInstance(UpdateRoomDto, { ...VALID, name: '' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('rejects maxPlayers below 2', async () => {
    const dto = plainToInstance(UpdateRoomDto, { ...VALID, maxPlayers: 1 });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'maxPlayers')).toBe(true);
  });

  it('rejects a non-boolean withBots', async () => {
    const dto = plainToInstance(UpdateRoomDto, { ...VALID, withBots: 'yes' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'withBots')).toBe(true);
  });
});
