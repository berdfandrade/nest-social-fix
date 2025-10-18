import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { env } from 'src/env';
import { GenerateMailTemplateFromHTMLService } from './services/generate-mail-template.service';
import {
	MailProvider,
	SendMailResponse,
	SendMailServiceDataProps,
} from './types/mail.provider-props';

@Injectable()
export class MailProviderImplementation implements MailProvider {
	private transporter = new Resend(env.RESEND_MAIL_KEY);

	constructor(
		private readonly generateMailTemplateFromHTMLService: GenerateMailTemplateFromHTMLService,
	) {}

	async execute({
		from = {
			email: env.MAIL_SENDER_EMAIL,
			name: env.MAIL_SENDER_NAME,
		},
		to,
		subject,
		templateFileName,
		templateVariables,
	}: SendMailServiceDataProps): Promise<SendMailResponse> {
		try {
			const mailTemplate =
				await this.generateMailTemplateFromHTMLService.execute({
					fileName: templateFileName,
					variables: {
						...templateVariables,
					},
				});

			const recipients = Array.isArray(to)
				? to.map(({ name, email }) => `${name} <${email}>`)
				: [`${to.name} <${to.email}>`];

			const response = await this.transporter.emails.send({
				from: `${from.name} <${from.email}>`,
				to: recipients,
				subject,
				html: mailTemplate,
			});

			return {
				ok: true,
				data: { id: response.data?.id || 'ethereal-fallback-id' },
			};
		} catch (error) {
			return { ok: false, error: { message: error.message || String(error) } };
		}
	}
}
