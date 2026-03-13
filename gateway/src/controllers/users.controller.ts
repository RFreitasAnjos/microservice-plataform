import {
  Controller,
  Get,
  Param,
  Req
} from '@nestjs/common'

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('Users')
@ApiBearerAuth()

@Controller('users/')
export class UsersController {

  @Get()
  getUsers(@Req() req) {
    return req.proxiedResponse
  }

  @Get(':id')
  getUser(@Param('id') id: string, @Req() req) {
    return req.proxiedResponse
  }

}