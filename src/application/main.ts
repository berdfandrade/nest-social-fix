import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const PORT = 3333;

	swaggerConfig(app);

	await app.listen(PORT);
	console.log(`🚀 Server is running on http://localhost:${PORT}`);
}
bootstrap();
