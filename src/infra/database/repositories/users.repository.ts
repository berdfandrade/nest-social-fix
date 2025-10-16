import { Roles } from '@common/constants/enums/user-roles.constant';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/users/user.schema';

@Injectable()
export class UsersRepository {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
	) {}

	async create(user: Partial<User>): Promise<UserDocument> {
		const createdUser = new this.userModel(user);
		return createdUser.save();
	}

	async findOne(filter: Partial<User>): Promise<UserDocument | null> {
		return this.userModel.findOne(filter).exec();
	}

	async findById(id: string): Promise<UserDocument | null> {
		return this.userModel.findById(id).exec();
	}

	async findByEmailAndRole(
		email: string,
		role: Roles,
	): Promise<UserDocument | null> {
		return this.userModel.findOne({ email, role }).exec();
	}

	async findAll(filter: Partial<User> = {}): Promise<UserDocument[]> {
		return this.userModel.find(filter).exec();
	}

	async update(
		filter: Partial<User>,
		update: Partial<User>,
	): Promise<UserDocument | null> {
		return this.userModel
			.findOneAndUpdate(filter, update, { new: true })
			.exec();
	}

	async delete(filter: Partial<User>): Promise<UserDocument | null> {
		return this.userModel.findOneAndDelete(filter).exec();
	}
}
