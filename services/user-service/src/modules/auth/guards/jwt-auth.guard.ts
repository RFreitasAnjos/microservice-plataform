import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'

@Injectable()
export class JwtAuthGuard implements CanActivate {

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest()

		const userIdHeader = request.headers['x-user-id']
		const userEmailHeader = request.headers['x-user-email']

		const userId = Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader
		const userEmail = Array.isArray(userEmailHeader) ? userEmailHeader[0] : userEmailHeader

		if (!userId) {
			throw new UnauthorizedException('Acesso não autorizado')
		}

		request.user = {
			id: userId,
			email: userEmail
		}

		return true
	}

}