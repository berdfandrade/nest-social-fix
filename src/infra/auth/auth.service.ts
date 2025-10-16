import { Roles } from '@common/constants/enums/user-roles.constant';
import { UsersRepository } from '@infra/database/repositories/users.repository';
import { UserDocument } from '@infra/database/schemas/users/user.schema';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { env } from 'src/env';

export abstract class AuthService {
	public abstract createAccessToken(
		user_id: string,
		role: Roles,
	): Promise<string>;
	public abstract createRefreshToken(user_id: string): Promise<string>;
	public abstract validateUser(user_id: string): Promise<UserDocument>;
}

@Injectable()
export class AuthServiceImplementation implements AuthService {
	constructor(private readonly usersRepository: UsersRepository) {}

	public async createAccessToken(user_id: string, role: Roles) {
		return sign({ sub: user_id, role }, env.JWT_SECRET, {
			expiresIn: '7d',
		});
	}

	public async createRefreshToken(user_id: string) {
		return sign({ sub: user_id }, env.JWT_REFRESH_SECRET, {
			expiresIn: '30d',
		});
	}

	public async validateUser(user_id: string) {
		const user = await this.usersRepository.findById(user_id);
		if (!user) {
			throw new ForbiddenException(
				'Usuário não encontrado. Faça login novamente.',
			);
		}

		return user;
	}
}
