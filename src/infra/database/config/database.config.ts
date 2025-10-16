import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'src/env';

@Module({
	imports: [MongooseModule.forRoot(env.MONGO_URI)],
	exports: [MongooseModule],
})
export class MongoConfig {}
