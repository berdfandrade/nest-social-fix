import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRolesEnum as Roles } from 'src/common/constants/enums/user-roles.constant';

export class CreateUserDTO {
	@ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({ example: 'password123', description: 'User password' })
	@IsNotEmpty()
	@IsString()
	password: string;

	@ApiProperty({
		example: Roles.VOLUNTEER,
		description: 'Role of the user in the system',
		enum: Roles,
	})
	@IsEnum(Roles)
	role: string;
}
