import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	ValidateNested,
} from 'class-validator';

export class AddressDTO {
	@ApiProperty({
		example: 'Rua das Flores, 123',
		description: 'Rua e número do endereço',
	})
	@IsNotEmpty()
	@IsString()
	street: string;

	@ApiProperty({ example: 'São Paulo', description: 'Cidade' })
	@IsNotEmpty()
	@IsString()
	city: string;

	@ApiProperty({ example: 'SP', description: 'Estado' })
	@IsNotEmpty()
	@IsString()
	state: string;

	@ApiProperty({ example: '01234-567', description: 'CEP' })
	@IsNotEmpty()
	@IsString()
	zipCode: string;

	@ApiProperty({ example: 'Brasil', description: 'País' })
	@IsNotEmpty()
	@IsString()
	country: string;
}

export class CreateOrganizerDTO {
	@ApiProperty({
		example: 'João Silva',
		description: 'Nome completo do organizador',
	})
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({
		example: 'joao.silva@example.com',
		description: 'Email do organizador',
	})
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiPropertyOptional({
		example: 'ONG Amigos do Bem',
		description: 'Nome da organização',
	})
	@IsOptional()
	@IsString()
	organization?: string;

	@ApiPropertyOptional({
		example:
			'Organização sem fins lucrativos focada em ajudar comunidades carentes',
		description: 'Descrição do organizador ou organização',
	})
	@IsOptional()
	@IsString()
	description?: string;

	@ApiPropertyOptional({
		example: '+55 11 99999-9999',
		description: 'Telefone de contato',
	})
	@IsOptional()
	@IsString()
	phone?: string;

	@ApiPropertyOptional({
		example: 'https://www.ongamigosdobem.org.br',
		description: 'Site da organização',
	})
	@IsOptional()
	@IsUrl()
	website?: string;

	@ApiPropertyOptional({
		type: AddressDTO,
		description: 'Endereço da organização',
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => AddressDTO)
	address?: AddressDTO;
}
