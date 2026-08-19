import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SendMessageDto } from './send-message.dto';

const VALID = {
  roomId: '11111111-1111-4111-8111-111111111111',
  playerId: '22222222-2222-4222-8222-222222222222',
  tempId: '33333333-3333-4333-8333-333333333333',
  content: 'hello',
};

describe('SendMessageDto', () => {
  it('passes with valid required fields', async () => {
    const dto = plainToInstance(SendMessageDto, VALID);

    expect(await validate(dto)).toHaveLength(0);
  });

  it('trims surrounding whitespace from content', () => {
    const dto = plainToInstance(SendMessageDto, { ...VALID, content: '  hello  ' });

    expect(dto.content).toBe('hello');
  });

  it('rejects content that is empty after trimming', async () => {
    const dto = plainToInstance(SendMessageDto, { ...VALID, content: '   ' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'content')).toBe(true);
  });

  it('rejects content over 500 characters', async () => {
    const dto = plainToInstance(SendMessageDto, { ...VALID, content: 'a'.repeat(501) });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'content')).toBe(true);
  });

  it('rejects a non-UUID roomId', async () => {
    const dto = plainToInstance(SendMessageDto, { ...VALID, roomId: 'nope' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'roomId')).toBe(true);
  });
});
