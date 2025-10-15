import { MONGO_DB_LOGS_MESSAGES as Log } from '@common/constants/logs/mongodb-logs.constant';
import { Logger } from '@nestjs/common';
import mongoose, { Connection } from 'mongoose';
import { env } from 'src/env';
import { MongoDBService } from 'src/infra/database/mongodb/mongodb.service';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('MongoDBService', () => {
	let mongoDBService: MongoDBService;
	let mockLogger: Pick<Logger, 'log' | 'error'>;

	beforeEach(() => {
		mockLogger = {
			log: vi.fn(),
			error: vi.fn(),
		};

		mongoDBService = new MongoDBService();

		Object.defineProperty(mongoDBService, 'logger', {
			value: mockLogger,
			writable: true,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should connect to MongoDB successfully', async () => {
		const mockConnection = { close: vi.fn() } as unknown as Connection;

		const createConnectionSpy = vi
			.spyOn(mongoose, 'createConnection')
			.mockReturnValueOnce({
				asPromise: vi.fn().mockResolvedValueOnce(mockConnection),
			} as unknown as mongoose.Connection);

		process.env.MONGO_URI = env.MONGO_URI;

		await mongoDBService.onModuleInit();

		expect(createConnectionSpy).toHaveBeenCalled();
		expect(mockLogger.log).toHaveBeenCalledWith(Log.CONNECTED);
	});

	it('should throw an error if connection to MongoDB fails', async () => {
		const mockError = new Error('Connection failed');

		process.env.MONGO_URI = 'mongodb://localhost:27017/test';
		vi.spyOn(mongoose, 'createConnection').mockReturnValueOnce({
			asPromise: vi.fn().mockRejectedValueOnce(mockError),
		} as unknown as mongoose.Connection);

		await expect(mongoDBService.onModuleInit()).rejects.toThrowError(mockError);
		expect(mockLogger.error).toHaveBeenCalledWith(
			Log.CONNECTION_FAILED,
			mockError,
		);
	});

	it('should close the connection properly', async () => {
		const mockClose = vi.fn().mockResolvedValue(undefined);

		Object.defineProperty(mongoDBService, 'connection', {
			value: { close: mockClose } as unknown as Connection,
			writable: true,
		});

		await mongoDBService.onModuleDestroy();

		expect(mockClose).toHaveBeenCalledTimes(1);
		expect(mockLogger.log).toHaveBeenCalledWith(Log.CLOSED);
	});

	it('should throw an error if getConnection is called before initialization', () => {
		expect(() => mongoDBService.getConnection()).toThrowError(
			Log.NOT_INITIALIZED,
		);
	});
});
