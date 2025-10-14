import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common';
import mongoose, { Connection } from 'mongoose';

@Injectable()
export class MongoDBService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(MongoDBService.name);
	private connection: Connection;

	async onModuleInit() {
		const uri =
			process.env.MONGO_URI ||
			'mongodb://localhost:27017/socialfix-test-database';
		this.logger.log(`Connecting to MongoDB at ${uri}...`);

		await mongoose.connect(uri);
		this.connection = mongoose.connection;

		this.connection.once('open', () =>
			this.logger.log('✅ Connected to MongoDB!'),
		);
		this.connection.on('error', (err) =>
			this.logger.error(`❌ MongoDB error: ${err}`),
		);
	}

	getConnection(): Connection {
		return this.connection;
	}

	getModel<T>(name: string, schema: mongoose.Schema): mongoose.Model<T> {
		if (mongoose.models[name]) {
			return mongoose.models[name] as mongoose.Model<T>;
		}
		return mongoose.model<T>(name, schema);
	}

	async onModuleDestroy() {
		await mongoose.disconnect();
		this.logger.log('🔌 MongoDB disconnected.');
	}
}
