import { AuthenticateUserDTO } from '@application/auth/dtos/autheticate-use.dto';
import { mapAuthUserData } from '@application/auth/mappers/user.mapper';
import { Roles } from '@common/constants/enums/user-roles.constant';
import { AuthService } from '@infra/auth/auth.service';
import { UsersRepository } from '@infra/database/repositories/users.repository';
import { HashProvider } from '@infra/providers/hash/types/hash.provider.props';
import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthenticateUserUseCase {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly hashProvider: HashProvider,
		private readonly authService: AuthService,
	) {}

	async execute({ email, password, role }: AuthenticateUserDTO) {
		const user = await this.usersRepository.findByEmailAndRole(email, role);
		if (!user) {
			throw new NotFoundException('Usuário não encontrado.');
		}

		const confirmedPassword = await this.hashProvider.compare(
			password,
			user.password,
		);

		if (!confirmedPassword) {
			throw new UnauthorizedException('Email e/ou senha inválido(s)');
		}

		const token = await this.authService.createAccessToken(
			user.id,
			user.role as Roles,
		);
		const refreshToken = await this.authService.createRefreshToken(user.id);

		return mapAuthUserData(user, { token, refreshToken });
	}
}
