import { Injectable } from '@nestjs/common';
import {
	SendMailResponse,
	SendMailServiceDataProps,
	TestMailProvider,
} from './types/mail.provider-props';

@Injectable()
export class FakeTestMailProvider implements TestMailProvider {
	async execute(data: SendMailServiceDataProps): Promise<SendMailResponse> {
		// eslint-disable-next-line no-console
		console.log('FakeTestMailProvider', data);
		return { ok: true, data: { id: 'fake-id' } };
	}
}
