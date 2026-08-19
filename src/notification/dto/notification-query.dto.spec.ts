import { plainToInstance } from 'class-transformer';
import { NotificationQueryDto } from './notification-query.dto';

describe('NotificationQueryDto', () => {
  it('defaults unreadOnly to false when omitted', () => {
    const dto = plainToInstance(NotificationQueryDto, {});

    expect(dto.unreadOnly).toBe(false);
  });

  it('accepts a real boolean true', () => {
    const dto = plainToInstance(NotificationQueryDto, { unreadOnly: true });

    expect(dto.unreadOnly).toBe(true);
  });

  it('coerces the string "true" into true', () => {
    const dto = plainToInstance(NotificationQueryDto, { unreadOnly: 'true' });

    expect(dto.unreadOnly).toBe(true);
  });

  it('coerces the string "false" into false', () => {
    const dto = plainToInstance(NotificationQueryDto, { unreadOnly: 'false' });

    expect(dto.unreadOnly).toBe(false);
  });
});
