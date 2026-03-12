import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './services/auth.service'
import { AuthController } from './controllers/auth.controller'
import { UsersRepository } from '../users/repositories/users.repository'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  imports: [
    JwtModule.register({
      secret: "supersecret",
      signOptions: { expiresIn: "1d" }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository, JwtStrategy]
})
export class AuthModule {}