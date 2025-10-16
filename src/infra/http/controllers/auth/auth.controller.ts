import { AuthenticateUserDTO } from '@application/auth/dtos/autheticate-use.dto';
import { RefreshTokenDTO } from '@application/auth/dtos/refresh-token.dto';
import { AuthenticateUserUseCase } from '@application/auth/use-cases/authenticate-user/authenticate-user.use-case';
import { RefreshTokenUseCase } from '@application/auth/use-cases/refresh-token/refresh-token.use-case';
import { Tags } from '@application/config/swagger.config';
import { IsPublic } from '@common/decorators/is-public.decorator';
import { Body, Controller, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@IsPublic()
@ApiTags(Tags.AUTH_CONTROLLER)
@Controller()
export class AuthController {
	constructor(
		private readonly authenticateUserUseCase: AuthenticateUserUseCase,
		private readonly refreshTokenUseCase: RefreshTokenUseCase,
	) {}

	@ApiOperation({
		description: 'Autenticar usuário',
	})
	@ApiResponse({
		description: 'OK',
		status: HttpStatus.OK,
	})
	@IsPublic()
	@Post('/login')
	async authenticateUser(@Body() data: AuthenticateUserDTO) {
		return await this.authenticateUserUseCase.execute(data);
	}

	@ApiOperation({ description: 'Gerar novo token válido' })
	@ApiResponse({
		description: 'OK',
		status: HttpStatus.OK,
	})
	@IsPublic()
	@Post('/refresh-token')
	async refreshToken(@Query() { token }: RefreshTokenDTO) {
		return await this.refreshTokenUseCase.execute(token);
	}
}
