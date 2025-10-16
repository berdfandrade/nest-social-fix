import { AuthUseCases } from '@application/auth/use-cases';
import { UserUseCases } from '@application/users/use-cases';
import { AuthModule } from '@infra/auth/auth.module';
import { AuthController } from '@infra/http/controllers/auth/auth.controller';
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { ProvidersModule } from 'src/infra/providers/providers.module';
import { UsersController } from './controllers/users/users.controller';

@Module({
	imports: [ProvidersModule, DatabaseModule, AuthModule],
	controllers: [AuthController, UsersController],
	providers: [...AuthUseCases, ...UserUseCases],
})
export class HttpModule {}
