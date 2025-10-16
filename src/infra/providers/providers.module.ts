import { Module } from '@nestjs/common';
import { HashProviderImplementation } from './hash/hash.provider';
import { HashProvider } from './hash/types/hash.provider.props';

@Module({
	providers: [
		{
			provide: HashProvider,
			useClass: HashProviderImplementation,
		},
	],
	exports: [HashProvider],
})
export class ProvidersModule {}
