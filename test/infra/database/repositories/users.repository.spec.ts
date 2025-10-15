import { Model, Query } from 'mongoose';
import { UserRolesEnum } from 'src/common/constants/user-roles.constant';
import { UsersRepository } from 'src/infra/database/repositories/users.repository';
import {
	User,
	UserDocument,
} from 'src/infra/database/schemas/users/user.schema';
import { beforeEach, describe, expect, it, Mocked, vi } from 'vitest';

const mockUser: User = {
	name: 'Bernardo',
	email: 'bernardo@example.com',
	password: '123456',
	role: UserRolesEnum.VOLUNTEER,
};

describe('UsersRepository', () => {
	let repository: UsersRepository;
	let userModel: Mocked<Model<UserDocument>>;

	beforeEach(() => {
		userModel = {
			findOne: vi.fn(),
			find: vi.fn(),
			findOneAndUpdate: vi.fn(),
			findOneAndDelete: vi.fn(),
		} as unknown as Mocked<Model<UserDocument>>;

		repository = new UsersRepository(userModel);
	});

	it('should create a user', async () => {
		const saveMock = vi.fn().mockResolvedValue(mockUser);
		const modelMock = vi.fn().mockImplementation(() => ({ save: saveMock }));

		repository = new UsersRepository(
			modelMock as unknown as Model<UserDocument>,
		);

		const result = await repository.create(mockUser);

		expect(saveMock).toHaveBeenCalled();
		expect(result).toEqual(mockUser);
	});

	it('should find one user', async () => {
		const execMock = vi.fn().mockResolvedValue(mockUser);

		(userModel.findOne as unknown as () => Query<
			UserDocument | null,
			UserDocument
		>) = vi.fn().mockReturnValue({ exec: execMock });

		const result = await repository.findOne({ email: mockUser.email });

		expect(userModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
		expect(result).toEqual(mockUser);
	});

	it('should find all users', async () => {
		const execMock = vi.fn().mockResolvedValue([mockUser]);

		(userModel.find as unknown as () => Query<UserDocument[], UserDocument>) =
			vi.fn().mockReturnValue({ exec: execMock });

		const result = await repository.findAll();

		expect(userModel.find).toHaveBeenCalledWith({});
		expect(result).toEqual([mockUser]);
	});

	it('should update a user', async () => {
		const execMock = vi.fn().mockResolvedValue(mockUser);

		(userModel.findOneAndUpdate as unknown as () => Query<
			UserDocument | null,
			UserDocument
		>) = vi.fn().mockReturnValue({ exec: execMock });

		const result = await repository.update(
			{ email: mockUser.email },
			{ name: 'Novo Nome' },
		);

		expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
			{ email: mockUser.email },
			{ name: 'Novo Nome' },
			{ new: true },
		);
		expect(result).toEqual(mockUser);
	});

	it('should delete a user', async () => {
		const execMock = vi.fn().mockResolvedValue(mockUser);

		(userModel.findOneAndDelete as unknown as () => Query<
			UserDocument | null,
			UserDocument
		>) = vi.fn().mockReturnValue({ exec: execMock });

		const result = await repository.delete({ email: mockUser.email });

		expect(userModel.findOneAndDelete).toHaveBeenCalledWith({
			email: mockUser.email,
		});
		expect(result).toEqual(mockUser);
	});
});
