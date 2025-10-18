import { OrganizersRepository } from '@infra/database/repositories/organizers.repository';
import {
	Organizer,
	OrganizerSchema,
} from '@infra/database/schemas/organizers/organizer.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

describe('OrganizersRepository (integration)', () => {
	let mongoServer: MongoMemoryServer;
	let repository: OrganizersRepository;

	beforeAll(async () => {
		mongoServer = await MongoMemoryServer.create();
		const uri = mongoServer.getUri();

		await mongoose.connect(uri);

		const OrganizerModel = mongoose.model(Organizer.name, OrganizerSchema);
		repository = new OrganizersRepository(OrganizerModel as any);
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
	});

	beforeEach(async () => {
		const db = mongoose.connection.db;
		if (!db) throw new Error('Database connection not initialized');
		await db.dropDatabase();
	});

	it('deve criar um organizer com sucesso', async () => {
		const organizer = await repository.create({
			name: 'AgroTech',
			email: 'contact@agrotech.com',
			userId: 'user123',
			verified: false,
			totalEvents: 0,
			rating: 4.5,
		});

		expect(organizer).toBeDefined();
		expect(organizer.name).toBe('AgroTech');

		const found = await repository.findOne({ email: 'contact@agrotech.com' });
		expect(found?.name).toBe('AgroTech');
	});

	it('deve buscar um organizer por ID', async () => {
		const created = await repository.create({
			name: 'Org 2',
			email: 'org2@mail.com',
			userId: 'u2',
			rating: 3.5,
		});

		const found = await repository.findById(created._id.toString());
		expect(found?.email).toBe('org2@mail.com');
	});

	it('deve atualizar o rating de um organizer', async () => {
		const created = await repository.create({
			name: 'Org 3',
			email: 'org3@mail.com',
			userId: 'u3',
			rating: 2,
		});

		const updated = await repository.updateRating(created._id.toString(), 5);
		expect(updated?.rating).toBe(5);
	});

	it('deve deletar um organizer', async () => {
		const created = await repository.create({
			name: 'Org 4',
			email: 'org4@mail.com',
			userId: 'u4',
		});

		const deleted = await repository.delete({ _id: created._id });
		expect(deleted).not.toBeNull(); // <- o método retorna o doc deletado

		const found = await repository.findById(created._id.toString());
		expect(found).toBeNull(); // <- confirma que foi realmente deletado
	});
});
