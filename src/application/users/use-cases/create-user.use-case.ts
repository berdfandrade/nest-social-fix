import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/infra/database/repositories/users.repository';
import { UserDocument } from 'src/infra/database/schemas/users/user.schema';
import { HashProvider } from 'src/infra/providers/hash/types/hash.provider.props';
import { CreateUserDTO } from '../dtos/create-user.dto';

@Injectable()
export class CreateUserUseCase {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly hashProvider: HashProvider,
	) {}

	async execute(dto: CreateUserDTO): Promise<UserDocument> {
		const existingUser = await this.usersRepository.findOne({
			email: dto.email,
		});
		if (existingUser) {
			throw new BadRequestException('Email already in use');
		}

		const hashedPassword = await this.hashProvider.hash(dto.password);

		const user = await this.usersRepository.create({
			...dto,
			password: hashedPassword,
		});

		const userObj = user.toObject();
		delete userObj.password;
		return userObj as UserDocument;
	}
}
