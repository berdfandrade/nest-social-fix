import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

export const setupTestDB = async () => {
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();

	await mongoose.connect(uri, {
		dbName: 'testdb',
	});
};

export const teardownTestDB = async () => {
	await mongoose.disconnect();
	if (mongoServer) await mongoServer.stop();
};

export const clearTestDB = async () => {
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany({});
	}
};
