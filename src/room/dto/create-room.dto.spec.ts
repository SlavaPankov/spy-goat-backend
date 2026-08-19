import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateRoomDto } from './create-room.dto';

const BASE = { name: 'Room One', code: 'ABC123', maxPlayers: 4 };

describe('CreateRoomDto', () => {
  it('requires a password when the room is private', async () => {
    const dto = plainToInstance(CreateRoomDto, { ...BASE, isPrivate: true });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('does not require a password for a public room', async () => {
    const dto = plainToInstance(CreateRoomDto, { ...BASE, isPrivate: false });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'password')).toBe(false);
  });

  it('passes when a private room includes a password', async () => {
    const dto = plainToInstance(CreateRoomDto, { ...BASE, isPrivate: true, password: 'secret123' });

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects a name that is too short', async () => {
    const dto = plainToInstance(CreateRoomDto, { ...BASE, name: 'ab', isPrivate: false });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('rejects fewer than 2 max players', async () => {
    const dto = plainToInstance(CreateRoomDto, { ...BASE, maxPlayers: 1, isPrivate: false });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'maxPlayers')).toBe(true);
  });

  it('currently accepts an empty string as a password for a private room', async () => {
    const dto = plainToInstance(CreateRoomDto, { ...BASE, isPrivate: true, password: '' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'password')).toBe(false);
  });
});
