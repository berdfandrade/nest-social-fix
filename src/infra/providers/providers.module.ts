import { Module } from '@nestjs/common';
import { env } from 'src/env';
import { HashProviderImplementation } from './hash/hash.provider';
import { HashProvider } from './hash/types/hash.provider.props';
import { MailProviderOptions } from './mail/constants/mail-use.constant';
import { MailProvider } from './mail/types/mail.provider-props';

@Module({
	providers: [
		{
			provide: HashProvider,
			useClass: HashProviderImplementation,
		},
		{
			provide: MailProvider,
			useClass: MailProviderOptions[env.NODE_ENV],
		},
	],
	exports: [HashProvider, MailProvider],
})
export class ProvidersModule {}
