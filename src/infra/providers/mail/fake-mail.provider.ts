import { logsAdapter } from '@common/adapters/api-logs/logs.adapter';
import { Injectable } from '@nestjs/common';
import {
	createTestAccount,
	createTransport,
	getTestMessageUrl,
	SendMailOptions,
	Transporter,
} from 'nodemailer';
import { env } from 'src/env';
import { GenerateMailTemplateFromHTMLService } from './services/generate-mail-template.service';
import {
	SendMailResponse,
	SendMailServiceDataProps,
	TestMailProvider,
} from './types/mail.provider-props';

@Injectable()
export class FakeMailProvider implements TestMailProvider {
	private transporter: Transporter;

	constructor(
		private readonly generateMailTemplateFromHTMLService: GenerateMailTemplateFromHTMLService,
	) {
		const setTransporter = async () => {
			const { smtp, user, pass } = await createTestAccount();

			this.transporter = createTransport({
				host: smtp.host,
				port: smtp.port,
				secure: smtp.secure,
				auth: {
					user,
					pass,
				},
			});
		};

		setTransporter().catch((error) =>
			logsAdapter.error('Erro ao criar transporter ethereal', error.message),
		);
	}

	public async execute({
		from = {
			email: env.MAIL_SENDER_EMAIL as string,
			name: env.MAIL_SENDER_NAME as string,
		},
		to,
		subject,
		templateFileName,
		templateVariables,
	}: SendMailServiceDataProps): Promise<SendMailResponse> {
		const mail: SendMailOptions = {
			from: {
				address: from.email,
				name: from.name,
			},

			to: Array.isArray(to)
				? to.map(({ email, name }) => ({ address: email, name }))
				: { address: to.email, name: to.name },

			subject,
		};

		mail.html = await this.generateMailTemplateFromHTMLService.execute({
			fileName: templateFileName,
			variables: {
				...templateVariables,
			},
		});

		const sentMail = await this.transporter.sendMail(mail);

		logsAdapter.success(
			'Email gerado com sucesso',
			`E-mail preview URL: ${getTestMessageUrl(sentMail)}`,
		);

		return {
			ok: true,
			data: { id: sentMail.messageId || getTestMessageUrl(sentMail) },
		};
	}
}
