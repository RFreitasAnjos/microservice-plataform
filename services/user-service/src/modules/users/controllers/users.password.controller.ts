import {
  Body,
  Controller,
  Param,
  Patch,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';

import {
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

import { UsersService } from '../services/users.service';
import { ChangePasswordDto } from '../dto/change-password.dto';

@ApiTags('Users Password')
@Controller({
  path: 'users/password',
  version: '1'
})
export class UsersPasswordController {

  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Alterar senha do usuário' })
  @ApiResponse({ status: 204 })
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePasswordDto: ChangePasswordDto
  ): Promise<void> {

    await this.usersService.recoverPassword(id, updatePasswordDto);
  }
}