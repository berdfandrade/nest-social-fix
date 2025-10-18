import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Injectable } from '@nestjs/common';
import { GenerateMailTemplateFromHTMLProps } from '../types/mail.provider-props';

@Injectable()
export class GenerateMailTemplateFromHTMLService {
	public execute = async ({
		fileName = 'mail.html',
		variables,
	}: GenerateMailTemplateFromHTMLProps): Promise<string> => {
		const file = join(process.cwd(), `templates/${fileName}`);

		let templateContent = await readFile(file, {
			encoding: 'utf-8',
		});

		Object.entries(variables).forEach(([key, value]) => {
			const regex = new RegExp(`{{${key}}}`, 'g');

			templateContent = templateContent.replace(regex, String(value));
		});

		return templateContent;
	};
}
