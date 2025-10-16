import { DatabaseModule } from '@infra/database/database.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { env } from 'src/env';
import { AuthService, AuthServiceImplementation } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [
		DatabaseModule,
		PassportModule,
		JwtModule.register({
			secret: env.JWT_SECRET,
			signOptions: {
				expiresIn: '7d',
			},
		}),
	],
	controllers: [],
	providers: [
		JwtStrategy,
		{
			provide: AuthService,
			useClass: AuthServiceImplementation,
		},
	],
	exports: [AuthService],
})
export class AuthModule {}
