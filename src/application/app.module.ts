import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from 'src/infra/http/http.module';

@Module({
	imports: [
		ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
		HttpModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
