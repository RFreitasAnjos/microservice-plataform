import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseBoolPipe
} from '@nestjs/common';

import {
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/response/user-response.dto';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1'
})
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuários' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  async findAll(
    @Query('includeInactive', new DefaultValuePipe(false), ParseBoolPipe) includeInactive: boolean
  ): Promise<UserResponseDto[]> {

    const users = await this.usersService.findAll(includeInactive);

    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeInactive', new DefaultValuePipe(false), ParseBoolPipe) includeInactive: boolean
  ): Promise<UserResponseDto> {

    const user = await this.usersService.findOne(id, includeInactive);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {

    const user = await this.usersService.update(id, updateUserDto);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Inativar usuário (exclusão lógica)' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<void> {

    await this.usersService.remove(id);
  }

  @Delete(':id/permanent')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover usuário permanentemente (fluxo administrativo)' })
  async removePermanently(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<void> {

    await this.usersService.removePermanently(id);
  }
}