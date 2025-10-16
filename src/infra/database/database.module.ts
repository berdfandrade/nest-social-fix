import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBService } from './mongodb/mongodb.service';
import { UsersRepository } from './repositories/users.repository';
import { User, UserSchema } from './schemas/users/user.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	providers: [MongoDBService, UsersRepository],
	exports: [UsersRepository],
})
export class DatabaseModule {}
