import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthService } from './services/auth.service'
import { AuthController } from './controllers/auth.controller'
import { UsersRepository } from '../users/repositories/users.repository'
import { JwtStrategy } from './strategies/jwt.strategy'
import { StringValue } from 'ms'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: (configService.get<string>('jwt.expiresIn') ?? '7d') as StringValue
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository, JwtStrategy]
})
export class AuthModule {}