import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerConfig(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle('Social - fix API')
		.setDescription('API do social fix')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document, {
		customSiteTitle: 'Social Fix [Docs]',
	});
}

export const Tags = {
	USER_CONTROLLER: '👤 Users',
	AUTH_CONTROLLER: '🔐 Auth',
};
