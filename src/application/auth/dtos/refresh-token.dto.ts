import { ApiProperty } from '@nestjs/swagger';

import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDTO {
	@ApiProperty({
		description: 'Token de refresh',
		example:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjI5MzQwMzIyfQ.1J4',
		type: String,
	})
	@IsNotEmpty({ message: 'Token de refresh é obrigatório' })
	@IsJWT({ message: 'Token de refresh deve ser um JWT válido' })
	readonly token: string;
}
