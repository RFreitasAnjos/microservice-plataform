import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt.guard';
import type { Response, Request } from 'express';

interface TokenRequest {
  token: string;
}

@Controller('auth')
export class AuthController {
  constructor(private configService: ConfigService) {}
  /**
   * Endpoint para receber token do Keycloak e salvar em HttpOnly cookie
   * 
   * Fluxo:
   * 1. Frontend autentica com Keycloak
   * 2. Frontend recebe access_token
   * 3. Frontend chama POST /auth/set-token com o token
   * 4. Backend salva em HttpOnly cookie
   * 5. Frontend remove token da memória (seguro!)
   * 
   * Requisições subsequentes:
   * - Cookie é automaticamente enviado (credentials: include)
   * - JWT strategy extrai do cookie
   * - Validação funciona normalmente
   */
  @Post('set-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  setTokenCookie(
    @Body() request: TokenRequest,
    @Res() response: Response,
  ): void {
    if (!request.token) {
      throw new BadRequestException('Token é obrigatório');
    }

    // Configurar cookie HttpOnly com máxima segurança
    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookie('auth_token', request.token, {
      httpOnly: true,           // Inacessível a JavaScript (XSS protection)
      secure: isProduction,     // Apenas HTTPS em produção
      sameSite: 'strict',       // CSRF protection
      path: '/',                // Disponível em toda aplicação
      maxAge: 24 * 60 * 60 * 1000, // 24 horas (deve corresponder ao JWT expiresIn)
    });

    response.send();
  }

  /**
   * Endpoint para limpar a sessão (logout)
   */
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res() response: Response): void {
    // Limpar cookie setando maxAge = 0
    response.cookie('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Expira imediatamente
    });

    response.send();
  }

  /**
   * Health check - confirma que auth está ok
   */
  @Post('health')
  @HttpCode(HttpStatus.OK)
  async health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  /**
   * Endpoint para iniciar login no Keycloak
   * Redireciona para a URL de autenticação do Keycloak
   */
  @Get('login')
  @Redirect()
  login(): { url: string; statusCode: number } {
    const keycloakBrowserUrl =
      this.configService.get<string>('KEYCLOAK_PUBLIC_URL') ||
      this.configService.get<string>('KEYCLOAK_URL') ||
      'http://localhost:8080';
    const realm = this.configService.get<string>('KEYCLOAK_REALM') || 'my-plataform';
    const clientId =
      this.configService.get<string>('KEYCLOAK_LOGIN_CLIENT_ID') ||
      this.configService.get<string>('KEYCLOAK_CLIENT_ID') ||
      'frontend';
    const redirectUri =
      this.configService.get<string>('KEYCLOAK_LOGIN_REDIRECT_URI') ||
      this.configService.get<string>('CORS_ORIGIN') ||
      'http://localhost:4000';

    const loginUrl = `${keycloakBrowserUrl}/realms/${realm}/protocol/openid-connect/auth?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid&prompt=login`;

    return {
      url: loginUrl,
      statusCode: 302,
    };
  }

  /**
   * Endpoint para obter dados do usuário autenticado
   * Verifica se o token no HttpOnly cookie é válido
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() request: Request) {
    const user = (request as any).user;
    if (!user) {
      throw new BadRequestException('Usuário não autenticado');
    }

    return {
      userId: user.userId,
      username: user.username,
      authenticated: true,
    };
  }
}
