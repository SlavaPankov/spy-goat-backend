import { ClassSerializerInterceptor, Controller, Get, Param, ParseUUIDPipe, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    console.log('here');
    return this.usersService.findOne(id);
  }
}
