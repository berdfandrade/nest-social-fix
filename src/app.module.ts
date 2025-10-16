import { JwtAccessAuthGuard } from '@infra/auth/guards/jwt-access-auth.guard';
import { RoleGuard } from '@infra/auth/guards/role.guard';
import { MongoConfig } from '@infra/database/config/database.config';
import { HttpModule } from '@infra/http/http.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

@Module({
	imports: [
		ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
		MongoConfig,
		HttpModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAccessAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RoleGuard,
		},
	],
})
export class AppModule {}
