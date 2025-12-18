import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from './entities/user.entity';
import { EErrorMessages } from '../types/enums/errorMessage';
import { EErrorStatus } from '../types/enums/errorStatus';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(readonly prisma: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(Number.parseInt(process.env.CRYPT_SALT ?? '10'));

    return await bcrypt.hash(password, salt);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();

    return plainToInstance(UserDto, users);
  }

  async findOne(id: string) {
    const currentUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!currentUser) {
      throw new NotFoundException(EErrorMessages.USER_NOT_FOUND);
    }

    return new UserEntity(currentUser);
  }

  async create(dto: CreateUserDto) {
    const { username, password: notHashedPassword, confirmPassword } = dto;
    const password = await this.hashPassword(notHashedPassword);

    const isPasswordMatched = await bcrypt.compare(confirmPassword, password);

    if (!isPasswordMatched) {
      throw new HttpException(EErrorMessages.PASSWORD_DOESNT_MATCH, EErrorStatus.BAD_REQUEST);
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new HttpException(EErrorMessages.USER_ALREADY_EXISTS, EErrorStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.create({ data: { username, password } });

    return new UserEntity(user);
  }
}
