export interface MailContactProps {
	name: string;
	email: string;
}

export interface TemplateVariablesProps {
	name?: string;
	email_logo?: string;
	title: string;
	message: string;
	label: string | 'none';
	link?: string;
}

export interface GenerateMailTemplateFromHTMLProps {
	fileName?: string;
	variables: TemplateVariablesProps;
}

export interface SendMailServiceDataProps {
	subject: string;
	to: MailContactProps[] | MailContactProps;
	from?: MailContactProps;
	templateFileName?: string;
	templateVariables: TemplateVariablesProps;
}

export interface SendMailResponseSuccess {
	id: unknown;
}

export interface SendMailResponseError {
	message: string;
}

export type SendMailResponse =
	| { ok: true; data: SendMailResponseSuccess }
	| { ok: false; error: SendMailResponseError };

export abstract class MailProvider {
	abstract execute(data: SendMailServiceDataProps): Promise<SendMailResponse>;
}

export abstract class TestMailProvider {
	abstract execute(data: SendMailServiceDataProps): Promise<SendMailResponse>;
}
