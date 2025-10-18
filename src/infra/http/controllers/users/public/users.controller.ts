import { Tags } from '@application/config/swagger.config';
import { CreateUserDTO } from '@application/users/dtos/create-user.dto';
import { CreateUserUseCase } from '@application/users/use-cases/create-user/create-user.use-case';
import { IsPublic } from '@common/decorators/is-public.decorator';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@IsPublic()
@ApiTags(Tags.USER_CONTROLLER)
@Controller('users')
export class UsersController {
	constructor(private readonly createUser: CreateUserUseCase) {}

	@ApiOperation({
		description: 'Criar um usuário',
	})
	@ApiResponse({
		description: 'OK',
		status: HttpStatus.OK,
	})
	@HttpCode(HttpStatus.OK)

	@Post()
	public async create(@Body() data: CreateUserDTO) {
		return await this.createUser.execute(data);
	}
}
