import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SearchQueryDto } from '../common/dto/search-query.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  findAll(@CurrentUser('userId') userId: string, @Query() query: SearchQueryDto) {
    return this.usersService.findAll(userId, query);
  }

  @Get('me')
  findMe(@CurrentUser('userId') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.usersService.findOne(id);
  }
}
