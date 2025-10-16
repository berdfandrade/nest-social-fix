import { UserRolesEnum } from '@common/constants/enums/user-roles.constant';
import { ALLOWED_ROLES_KEY } from '@common/decorators/allowed-roles.decorator';
import { UserDocument } from '@infra/database/schemas/users/user.schema';
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
	private readonly logger = new Logger(RoleGuard.name);

	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const allowedRoles = this.reflector.getAllAndOverride<UserRolesEnum[]>(
			ALLOWED_ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (!allowedRoles) return true;

		const request = context.switchToHttp().getRequest<{ user: UserDocument }>();
		const { user } = request;

		if (!user || !user.role) {
			this.logger.warn(
				'Tentativa de acesso sem usuário autenticado ou sem papel definido.',
			);
			throw new ForbiddenException(
				'Você não tem permissão para acessar este recurso.',
			);
		}

		const isAllowed = allowedRoles.includes(user.role as UserRolesEnum);

		if (!isAllowed) {
			this.logger.warn(
				`Acesso negado para o usuário "${user.email}" com role "${user.role}". ` +
					`roles permitidos: [${allowedRoles.join(', ')}].`,
			);
			throw new ForbiddenException(
				'Você não tem permissão para acessar este recurso.',
			);
		}

		this.logger.debug(
			`Acesso permitido para o usuário "${user.email}" com papel "${user.role}".`,
		);

		return true;
	}
}
