import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose, { Connection } from 'mongoose';

@Injectable()
export class MongoDBService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(MongoDBService.name);
	private connection: Connection | null = null;

	constructor(private readonly configService: ConfigService) {}

	async onModuleInit() {
		const uri = this.configService.get<string>('MONGO_URI');

		if (!uri) {
			this.logger.error('MONGO_URI not defined in environment variables');
			throw new Error('Missing MongoDB URI');
		}

		try {
			const connection = await mongoose.createConnection(uri).asPromise();
			this.connection = connection;
			this.logger.log('MongoDB connected successfully');
		} catch (error) {
			this.logger.error('Failed to connect to MongoDB', error);
			throw error;
		}
	}

	getConnection(): Connection {
		if (!this.connection) {
			throw new Error('MongoDB connection not initialized');
		}
		return this.connection;
	}

	async onModuleDestroy() {
		if (this.connection) {
			await this.connection.close();
			this.logger.log('MongoDB connection closed');
		}
	}
}
