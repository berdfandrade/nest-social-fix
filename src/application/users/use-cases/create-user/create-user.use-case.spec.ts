import { UsersRepository } from 'src/infra/database/repositories/users.repository';
import {
	User,
	UserDocument,
	UserSchema,
} from 'src/infra/database/schemas/users/user.schema';
import {
	clearTestDB,
	setupTestDB,
	teardownTestDB,
} from 'test/config/mongodb-memory-server.setup';
import { createMongooseModel } from 'test/utils/create-mongoose-model.utils';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

let usersRepository: UsersRepository;

beforeAll(async () => {
	await setupTestDB();
	const userModel = createMongooseModel<UserDocument>(User.name, UserSchema);
	usersRepository = new UsersRepository(userModel);
});

afterAll(async () => {
	await teardownTestDB();
});

beforeEach(async () => {
	await clearTestDB();
});

describe('UsersRepository', () => {
	it('should create a user', async () => {
		const user = await usersRepository.create({
			name: 'John Doe',
			email: 'john@example.com',
			password: '123456',
			role: 'VOLUNTEER',
		});

		expect(user).toHaveProperty('_id');
		expect(user.name).toBe('John Doe');
	});
});
