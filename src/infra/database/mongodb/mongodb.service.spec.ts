import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MongoDBService } from './mongodb.service';

describe('MongoDBService (integration)', () => {
	let mongoService: MongoDBService;

	beforeAll(async () => {
		// Mock simples do ConfigService
		const configService = {
			get: (key: string) =>
				key === 'MONGO_URI'
					? process.env.MONGO_URI_TEST ||
						'mongodb://localhost:27017/socialfix-test-database'
					: undefined,
		} as unknown as ConfigService;

		mongoService = new MongoDBService(configService);
		await mongoService.onModuleInit();
	});

	afterAll(async () => {
		// Limpa o banco de testes
		await mongoose.connection.dropDatabase();
		await mongoService.onModuleDestroy();
	});

	it('should connect successfully to MongoDB', () => {
		const connection = mongoService.getConnection();
		expect(connection).toBeDefined();
		expect(connection.readyState).toBe(1); // 1 = conectado
	});

	it('should create and retrieve a model', async () => {
		// Cria schema simples
		const TestSchema = new mongoose.Schema({ name: String });
		const TestModel = mongoService.getModel<{ name: string }>(
			'Test',
			TestSchema,
		);

		// Cria documento
		await TestModel.create({ name: 'Bernardo' });
		const docs = await TestModel.find();

		expect(docs.length).toBe(1);
		expect(docs[0].name).toBe('Bernardo');
	});

	it('should disconnect successfully', async () => {
		await mongoService.onModuleDestroy();
		expect(mongoose.connection.readyState).toBe(0);
	});
});
