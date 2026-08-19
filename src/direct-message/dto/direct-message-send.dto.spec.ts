import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { DirectMessageSendDto, DirectMessageEditDto } from './direct-message-send.dto';

const VALID = { recipientId: '11111111-1111-4111-8111-111111111111', content: 'hello' };

describe('DirectMessageSendDto', () => {
  it('passes with just recipientId and content', async () => {
    const dto = plainToInstance(DirectMessageSendDto, VALID);

    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects a non-UUID recipientId', async () => {
    const dto = plainToInstance(DirectMessageSendDto, { ...VALID, recipientId: 'not-a-uuid' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'recipientId')).toBe(true);
  });

  it('rejects empty content', async () => {
    const dto = plainToInstance(DirectMessageSendDto, { ...VALID, content: '' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'content')).toBe(true);
  });

  it('rejects content over 2000 characters', async () => {
    const dto = plainToInstance(DirectMessageSendDto, { ...VALID, content: 'a'.repeat(2001) });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'content')).toBe(true);
  });

  it('allows replyToId to be omitted, but rejects it when malformed', async () => {
    const omitted = plainToInstance(DirectMessageSendDto, VALID);
    expect(await validate(omitted)).toHaveLength(0);

    const malformed = plainToInstance(DirectMessageSendDto, { ...VALID, replyToId: 'not-a-uuid' });
    const errors = await validate(malformed);
    expect(errors.some((e) => e.property === 'replyToId')).toBe(true);
  });
});

describe('DirectMessageEditDto', () => {
  it('rejects empty content', async () => {
    const dto = plainToInstance(DirectMessageEditDto, { content: '' });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === 'content')).toBe(true);
  });

  it('passes with valid content', async () => {
    const dto = plainToInstance(DirectMessageEditDto, { content: 'edited' });

    expect(await validate(dto)).toHaveLength(0);
  });
});
