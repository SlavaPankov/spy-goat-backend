import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { MatchDecorator } from './match.decorator';

class MatchTestDto {
  password: string;

  @MatchDecorator('password')
  confirmPassword: string;
}

describe('MatchDecorator default message', () => {
  it('falls back to the generated defaultMessage when no custom message is given', async () => {
    const dto = plainToInstance(MatchTestDto, { password: 'abc', confirmPassword: 'xyz' });

    const errors = await validate(dto);

    const confirmPasswordError = errors.find((e) => e.property === 'confirmPassword');
    expect(confirmPasswordError?.constraints).toEqual(
      expect.objectContaining({ Match: 'confirmPassword must match password' })
    );
  });
});

describe('MatchDecorator (via CreateUserDto.confirmPassword)', () => {
  it('fails validation when confirmPassword does not match password', async () => {
    const dto = plainToInstance(CreateUserDto, {
      username: 'alice',
      password: 'password123',
      confirmPassword: 'different',
    });

    const errors = await validate(dto);

    const confirmPasswordError = errors.find((e) => e.property === 'confirmPassword');
    expect(confirmPasswordError).toBeDefined();
    expect(confirmPasswordError?.constraints).toEqual(expect.objectContaining({ Match: 'Passwords do not match' }));
  });

  it('passes validation when confirmPassword matches password', async () => {
    const dto = plainToInstance(CreateUserDto, {
      username: 'alice',
      password: 'password123',
      confirmPassword: 'password123',
    });

    const errors = await validate(dto);

    expect(errors.find((e) => e.property === 'confirmPassword')).toBeUndefined();
  });
});
