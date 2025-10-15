import { MONGO_DB_LOGS_MESSAGES as Log } from '@common/constants/logs/mongodb-logs.constant';
import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common';

import mongoose, { Connection } from 'mongoose';
import { env } from 'src/env';

@Injectable()
export class MongoDBService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(MongoDBService.name);
	private connection: Connection | null = null;

	async onModuleInit() {
		const uri = env.MONGO_URI;

		if (!uri) {
			this.logger.error(Log.MISSING_URI);
			throw new Error(Log.MISSING_URI_ERROR);
		}

		try {
			const connection = await mongoose.createConnection(uri).asPromise();
			this.connection = connection;
			this.logger.log(Log.CONNECTED);
		} catch (error) {
			this.logger.error(Log.CONNECTION_FAILED, error);
			throw error;
		}
	}

	getConnection(): Connection {
		if (!this.connection) {
			throw new Error(Log.NOT_INITIALIZED);
		}
		return this.connection;
	}

	async onModuleDestroy() {
		if (this.connection) {
			await this.connection.close();
			this.logger.log(Log.CLOSED);
		}
	}
}
