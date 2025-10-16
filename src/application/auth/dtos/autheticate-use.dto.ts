import { UserRolesEnum as RolesEnum } from '@common/constants/enums/user-roles.constant';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsString,
	MinLength,
} from 'class-validator';

export class AuthenticateUserDTO {
	@ApiProperty({
		example: 'classificagro@email.com',
		description: 'Email do usuário',
		type: String,
		required: true,
	})
	@IsNotEmpty({ message: 'Email do usuário é obrigatório' })
	@IsEmail({}, { message: 'Email do usuário inválido' })
	@Transform(({ value }) => String(value).toLowerCase())
	readonly email: string;

	@ApiProperty({
		example: 'Teste@123',
		description: 'Senha do usuário',
		type: String,
		required: true,
	})
	@IsNotEmpty({ message: 'Senha do usuário é obrigatória' })
	@IsString({ message: 'Senha do usuário deve ser uma string' })
	@MinLength(6, { message: 'Senha do usuário deve ter no mínimo 6 caracteres' })
	readonly password: string;

	@ApiProperty({
		description: 'Perfil do usuário',
		enum: RolesEnum,
		required: true,
	})
	@IsNotEmpty({ message: 'Perfil do usuário é obrigatório' })
	@IsEnum(RolesEnum, { message: 'Perfil do usuário inválido' })
	readonly role: RolesEnum;
}
