import { AuthenticateUserDTO } from '@application/auth/dtos/autheticate-use.dto';
import { UserRolesEnum as Roles } from '@common/constants/enums/user-roles.constant';
import { AuthService } from '@infra/auth/auth.service';
import { UsersRepository } from '@infra/database/repositories/users.repository';
import { UserDocument } from '@infra/database/schemas/users/user.schema';
import { HashProvider } from '@infra/providers/hash/types/hash.provider.props';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { beforeEach, describe, expect, it, Mocked, vi } from 'vitest';
import { AuthenticateUserUseCase } from './authenticate-user.use-case';

vi.mock('@application/auth/mappers/user.mapper', () => ({
	mapAuthUserData: vi.fn((user, tokens) => ({
		id: user.id,
		email: user.email,
		role: user.role,
		...tokens,
	})),
}));

describe('AuthenticateUserUseCase (Vitest)', () => {
	let useCase: AuthenticateUserUseCase;
	let usersRepository: Mocked<UsersRepository>;
	let hashProvider: Mocked<HashProvider>;
	let authService: Mocked<AuthService>;

	beforeEach(() => {
		usersRepository = {
			findByEmailAndRole: vi.fn(),
		} as unknown as Mocked<UsersRepository>;

		hashProvider = {
			compare: vi.fn(),
		} as unknown as Mocked<HashProvider>;

		authService = {
			createAccessToken: vi.fn(),
			createRefreshToken: vi.fn(),
		} as unknown as Mocked<AuthService>;

		useCase = new AuthenticateUserUseCase(
			usersRepository,
			hashProvider,
			authService,
		);
	});

	it('deve autenticar o usuário com sucesso', async () => {
		const fakeUser: UserDocument = {
			id: 'user-123',
			email: 'test@example.com',
			password: 'hashed-password',
			role: Roles.VOLUNTEER,
		} as unknown as UserDocument;

		usersRepository.findByEmailAndRole.mockResolvedValue(fakeUser);
		hashProvider.compare.mockResolvedValue(true);
		authService.createAccessToken.mockResolvedValue('access-token');
		authService.createRefreshToken.mockResolvedValue('refresh-token');

		const payload: AuthenticateUserDTO = {
			email: fakeUser.email,
			password: 'plain-password',
			role: fakeUser.role as Roles,
		};

		const result = await useCase.execute(payload);

		expect(usersRepository.findByEmailAndRole).toHaveBeenCalledWith(
			fakeUser.email,
			fakeUser.role,
		);
		expect(hashProvider.compare).toHaveBeenCalledWith(
			'plain-password',
			fakeUser.password,
		);
		expect(authService.createAccessToken).toHaveBeenCalledWith(
			fakeUser.id,
			fakeUser.role,
		);
		expect(authService.createRefreshToken).toHaveBeenCalledWith(fakeUser.id);

		expect(result).toEqual(
			expect.objectContaining({
				id: fakeUser.id,
				email: fakeUser.email,
				role: fakeUser.role,
				token: 'access-token',
				refreshToken: 'refresh-token',
			}),
		);
	});

	it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
		usersRepository.findByEmailAndRole.mockResolvedValue(null);

		const payload: AuthenticateUserDTO = {
			email: 'inexistente@example.com',
			password: '123456',
			role: Roles.ORGANIZER,
		};

		await expect(useCase.execute(payload)).rejects.toThrowError(
			NotFoundException,
		);
	});

	it('deve lançar UnauthorizedException se a senha estiver incorreta', async () => {
		const fakeUser: UserDocument = {
			id: 'user-123',
			email: 'test@example.com',
			password: 'hashed-password',
			role: Roles.ADMIN,
		} as unknown as UserDocument;

		usersRepository.findByEmailAndRole.mockResolvedValue(fakeUser);
		hashProvider.compare.mockResolvedValue(false);

		const payload: AuthenticateUserDTO = {
			email: fakeUser.email,
			password: 'senha-errada',
			role: fakeUser.role as Roles,
		};

		await expect(useCase.execute(payload)).rejects.toThrowError(
			UnauthorizedException,
		);
	});
});
