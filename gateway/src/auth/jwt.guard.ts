import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'

import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtAuthGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {

    const request = context.switchToHttp().getRequest()

    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new UnauthorizedException('Token não enviado')
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException('Token mal formatado')
    }

    try {

      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret'
      )

      /**
       * injeta usuário no request
       */
      request.user = payload

      /**
       * injeta headers para microservices
       */
      request.headers['x-user-id'] = payload['sub']
      request.headers['x-user-email'] = payload['email']

      return true

    } catch (error) {

      throw new UnauthorizedException('Token inválido')

    }

  }

}