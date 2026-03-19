import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProxyService } from '../proxy/proxy.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('api/users')
export class UsersProxyController {
  constructor(private proxyService: ProxyService) {}

  // ============================================================
  // ROTAS PÚBLICAS (sem autenticação)
  // ============================================================

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.proxyService.post('/users', createUserDto);
  }

  /**
   * Health check - DEVE VIR ANTES DE :id
   */
  @Get('health/check')
  async healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  // ============================================================
  // ROTAS PROTEGIDAS (requerem JWT)
  // ============================================================

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Query() query: any, @Req() req: any) {
    const headers = this.extractHeaders(req);
    const queryString = new URLSearchParams(query).toString();
    return this.proxyService.get(
      `/users${queryString ? '?' + queryString : ''}`,
      headers,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string, @Query() query: any, @Req() req: any) {
    const headers = this.extractHeaders(req);
    const queryString = new URLSearchParams(query).toString();
    return this.proxyService.get(
      `/users/${id}${queryString ? '?' + queryString : ''}`,
      headers,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    const headers = this.extractHeaders(req);
    return this.proxyService.patch(`/users/${id}`, updateUserDto, headers);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string, @Req() req: any) {
    const headers = this.extractHeaders(req);
    return this.proxyService.delete(`/users/${id}`, headers);
  }

  @Delete(':id/permanent')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePermanentlyUser(@Param('id') id: string, @Req() req: any) {
    const headers = this.extractHeaders(req);
    return this.proxyService.delete(`/users/${id}/permanent`, headers);
  }

  @Patch('password/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: any,
  ) {
    const headers = this.extractHeaders(req);
    return this.proxyService.patch(
      `/users/password/${id}`,
      changePasswordDto,
      headers,
    );
  }

  private extractHeaders(req: any) {
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error('Authorization header is missing');
    }
    return {
      Authorization: auth,
      'Content-Type': 'application/json',
    };
  }
}