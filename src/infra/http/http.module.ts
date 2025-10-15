import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { ProvidersModule } from 'src/infra/providers/providers.module';

@Module({
	imports: [ProvidersModule, DatabaseModule],
	controllers: [],
	providers: [],
})
export class HttpModule {}
