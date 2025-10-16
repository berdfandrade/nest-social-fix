import { Roles } from '@common/constants/enums/user-roles.constant';
import { AuthService } from '@infra/auth/auth.service';
import { UsersRepository } from '@infra/database/repositories/users.repository';
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { verify } from 'jsonwebtoken';
import { env } from 'src/env';

export interface TokenPayloadProps {
	sub: string;
}

@Injectable()
export class RefreshTokenUseCase {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly authService: AuthService,
	) {}

	async execute(token: string) {
		let decodeToken: TokenPayloadProps;
		try {
			decodeToken = verify(token, env.JWT_REFRESH_SECRET) as TokenPayloadProps;
		} catch (_) {
			throw new BadRequestException('Token inválido');
		}

		if (!decodeToken.sub) {
			throw new BadRequestException('Token inválido');
		}

		const { sub } = decodeToken as TokenPayloadProps;
		const user = await this.usersRepository.findById(sub);

		if (!user) {
			throw new NotFoundException('Usuário não encontrado');
		}

		const newToken = await this.authService.createAccessToken(
			user.id,
			user?.role as Roles,
		);

		return { token: newToken };
	}
}
