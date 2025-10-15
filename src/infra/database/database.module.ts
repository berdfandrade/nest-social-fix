import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoDBService } from './mongodb/mongodb.service';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true })],
	providers: [MongoDBService],
	exports: [MongoDBService],
})
export class DatabaseModule {}
