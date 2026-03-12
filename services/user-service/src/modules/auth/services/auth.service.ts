import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersRepository } from '../../users/repositories/users.repository'
import { JwtService } from '@nestjs/jwt'
import { HashService } from 'src/common/security/hash.service'

@Injectable()
export class AuthService {

  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService
  ) {}

  async login(email: string, password: string) {

    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const passwordValid = await HashService.compare(
      password,
      user.password
    )

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload = {
      sub: user.id,
      email: user.email
    }

    return {
      access_token: this.jwtService.sign(payload)
    }

  }

}