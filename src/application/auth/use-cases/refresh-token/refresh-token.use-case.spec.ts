import { UserRolesEnum as Roles } from '@common/constants/enums/user-roles.constant';
import { AuthService } from '@infra/auth/auth.service';
import { UsersRepository } from '@infra/database/repositories/users.repository';
import { UserDocument } from '@infra/database/schemas/users/user.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { env } from 'src/env';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import {
	RefreshTokenUseCase,
	TokenPayloadProps,
} from './refresh-token.use-case';

const verifyMock =
	vi.fn<(token: string, secret: string) => TokenPayloadProps>();

vi.mock('jsonwebtoken', () => ({
	verify: (token: string, secret: string) => verifyMock(token, secret),
}));

vi.mock('src/env', () => ({
	env: {
		JWT_REFRESH_SECRET: 'fake-refresh-secret',
	},
}));

describe('RefreshTokenUseCase (Vitest)', () => {
	let useCase: RefreshTokenUseCase;
	let usersRepository: UsersRepository;
	let authService: AuthService;

	beforeEach(() => {
		usersRepository = {
			findById: vi.fn(),
		} as unknown as UsersRepository;

		authService = {
			createAccessToken: vi.fn(),
		} as unknown as AuthService;

		useCase = new RefreshTokenUseCase(usersRepository, authService);

		vi.clearAllMocks();
	});

	it('deve gerar um novo token com sucesso', async () => {
		const fakeUser: Pick<UserDocument, 'id' | 'email' | 'role'> = {
			id: 'user-123',
			email: 'user@example.com',
			role: Roles.ADMIN,
		};

		(usersRepository.findById as Mock).mockResolvedValue(
			fakeUser as unknown as UserDocument,
		);
		(authService.createAccessToken as Mock).mockResolvedValue(
			'new-access-token',
		);
		verifyMock.mockReturnValue({ sub: fakeUser.id });

		const result = await useCase.execute('valid-refresh-token');

		expect(verifyMock).toHaveBeenCalledWith(
			'valid-refresh-token',
			env.JWT_REFRESH_SECRET,
		);
		expect(usersRepository.findById).toHaveBeenCalledWith(fakeUser.id);
		expect(authService.createAccessToken).toHaveBeenCalledWith(
			fakeUser.id,
			fakeUser.role,
		);
		expect(result).toEqual({ token: 'new-access-token' });
	});

	it('deve lançar BadRequestException se o token for inválido', async () => {
		verifyMock.mockImplementation(() => {
			throw new Error('invalid token');
		});

		await expect(useCase.execute('invalid-token')).rejects.toThrowError(
			BadRequestException,
		);
	});

	it('deve lançar BadRequestException se o token não tiver "sub"', async () => {
		verifyMock.mockReturnValue({} as TokenPayloadProps);

		await expect(useCase.execute('token-sem-sub')).rejects.toThrowError(
			BadRequestException,
		);
	});

	it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
		verifyMock.mockReturnValue({ sub: 'missing-user' });
		(usersRepository.findById as Mock).mockResolvedValue(null);

		await expect(useCase.execute('token-valido')).rejects.toThrowError(
			NotFoundException,
		);
	});
});
