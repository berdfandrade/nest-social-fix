import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
	Organizer,
	OrganizerDocument,
} from '../schemas/organizers/organizer.schema';

@Injectable()
export class OrganizersRepository {
	constructor(
		@InjectModel(Organizer.name)
		private readonly organizerModel: Model<OrganizerDocument>,
	) {}

	async create(organizer: Partial<Organizer>): Promise<OrganizerDocument> {
		try {
			const createdOrganizer = new this.organizerModel(organizer);
			return await createdOrganizer.save();
		} catch (error) {
			throw new Error(
				`Failed to create organizer: ${(error as Error).message}`,
			);
		}
	}

	async findOne(filter: Partial<Organizer>): Promise<OrganizerDocument | null> {
		try {
			return await this.organizerModel.findOne(filter).exec();
		} catch (error) {
			throw new Error(`Failed to find organizer: ${(error as Error).message}`);
		}
	}

	async findById(id: string): Promise<OrganizerDocument | null> {
		return this.organizerModel.findById(id).exec();
	}

	async findByUserId(userId: string): Promise<OrganizerDocument | null> {
		return this.organizerModel.findOne({ userId }).exec();
	}

	async findByEmail(email: string): Promise<OrganizerDocument | null> {
		return this.organizerModel.findOne({ email }).exec();
	}

	async findAll(filter: Partial<Organizer> = {}): Promise<OrganizerDocument[]> {
		return this.organizerModel.find(filter).exec();
	}

	async findVerifiedOrganizers(): Promise<OrganizerDocument[]> {
		return this.organizerModel.find({ verified: true }).exec();
	}

	async findTopRatedOrganizers(
		limit: number = 10,
	): Promise<OrganizerDocument[]> {
		return this.organizerModel
			.find({ verified: true })
			.sort({ rating: -1 })
			.limit(limit)
			.exec();
	}

	async update(
		filter: Partial<Organizer>,
		update: Partial<Organizer>,
	): Promise<OrganizerDocument | null> {
		return this.organizerModel
			.findOneAndUpdate(filter, update, { new: true })
			.exec();
	}

	async updateRating(
		organizerId: string,
		newRating: number,
	): Promise<OrganizerDocument | null> {
		return this.organizerModel
			.findByIdAndUpdate(organizerId, { rating: newRating }, { new: true })
			.exec();
	}

	async incrementEventCount(
		organizerId: string,
	): Promise<OrganizerDocument | null> {
		return this.organizerModel
			.findByIdAndUpdate(
				organizerId,
				{ $inc: { totalEvents: 1 } },
				{ new: true },
			)
			.exec();
	}

	async verifyOrganizer(
		organizerId: string,
	): Promise<OrganizerDocument | null> {
		return this.organizerModel
			.findByIdAndUpdate(organizerId, { verified: true }, { new: true })
			.exec();
	}

	async delete(
		filter: Partial<Organizer> & { _id?: any },
	): Promise<OrganizerDocument | null> {
		return this.organizerModel.findOneAndDelete(filter).exec();
	}
}
