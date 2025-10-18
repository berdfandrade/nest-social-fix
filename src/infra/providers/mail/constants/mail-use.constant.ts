import { FakeMailProvider } from '../fake-mail.provider';
import { FakeTestMailProvider } from '../fake-test.mail.provider';
import { MailProviderImplementation } from '../mail.provider';

export const MailProviderOptions = {
	development: FakeMailProvider,
	production: MailProviderImplementation,
	test: FakeTestMailProvider,
};
