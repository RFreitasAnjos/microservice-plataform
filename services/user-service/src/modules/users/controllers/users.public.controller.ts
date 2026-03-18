import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';

import {
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/response/user-response.dto';

@ApiTags('Users Public')
@Controller({
  path: 'users',
  version: '1'
})
export class UsersPublicController {

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar conta de usuário' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserResponseDto> {

    const user = await this.usersService.createUser(createUserDto);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  }
}