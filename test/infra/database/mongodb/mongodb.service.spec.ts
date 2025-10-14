import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose, { Connection } from 'mongoose';
import { MongoDBService } from 'src/infra/database/mongodb/mongodb.service';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('MongoDBService', () => {
	let mongoDBService: MongoDBService;
	let configService: ConfigService;
	let mockLogger: Pick<Logger, 'log' | 'error'>;

	beforeEach(() => {
		configService = new ConfigService();

		mockLogger = {
			log: vi.fn(),
			error: vi.fn(),
		};

		mongoDBService = new MongoDBService(configService);

		Object.defineProperty(mongoDBService, 'logger', {
			value: mockLogger,
			writable: true,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should connect to MongoDB successfully', async () => {
		const mockConnection = {
			close: vi.fn(),
		} as unknown as Connection;

		const createConnectionSpy = vi
			.spyOn(mongoose, 'createConnection')
			.mockReturnValueOnce({
				asPromise: vi.fn().mockResolvedValueOnce(mockConnection),
			} as unknown as mongoose.Connection);

		vi.spyOn(configService, 'get').mockReturnValue(
			'mongodb://localhost:27017/test',
		);

		await mongoDBService.onModuleInit();

		expect(createConnectionSpy).toHaveBeenCalled();
		expect(mockLogger.log).toHaveBeenCalledWith(
			'MongoDB connected successfully',
		);
	});

	it('should throw an error if MONGODB_URI is not defined', async () => {
		vi.spyOn(configService, 'get').mockReturnValue(undefined);

		await expect(mongoDBService.onModuleInit()).rejects.toThrowError(
			'Missing MongoDB URI',
		);
		expect(mockLogger.error).toHaveBeenCalledWith(
			'MONGODB_URI not defined in environment variables',
		);
	});

	it('should throw an error if connection to MongoDB fails', async () => {
		const mockError = new Error('Connection failed');

		vi.spyOn(configService, 'get').mockReturnValue(
			'mongodb://localhost:27017/test',
		);
		vi.spyOn(mongoose, 'createConnection').mockReturnValueOnce({
			asPromise: vi.fn().mockRejectedValueOnce(mockError),
		} as unknown as mongoose.Connection);

		await expect(mongoDBService.onModuleInit()).rejects.toThrowError(mockError);
		expect(mockLogger.error).toHaveBeenCalledWith(
			'Failed to connect to MongoDB',
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
		expect(mockLogger.log).toHaveBeenCalledWith('MongoDB connection closed');
	});

	it('should throw an error if getConnection is called before initialization', () => {
		expect(() => mongoDBService.getConnection()).toThrowError(
			'MongoDB connection not initialized',
		);
	});
});
