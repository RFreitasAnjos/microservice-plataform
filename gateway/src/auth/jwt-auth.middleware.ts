import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new UnauthorizedException('Token não enviado')
    }

    const [, token] = authHeader.split(' ')

    if (!token) {
      throw new UnauthorizedException('Token mal formatado')
    }

    try {

      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret'
      ) as jwt.JwtPayload

      req['user'] = payload
      req.headers['x-user-id'] = payload['sub']
      req.headers['x-user-email'] = payload['email']

      next()

    } catch {
      throw new UnauthorizedException('Token inválido')
    }

  }

}
