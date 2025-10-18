import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrganizerDocument = HydratedDocument<Organizer>;

@Schema({ timestamps: true })
export class Organizer {
	@Prop({ type: String, required: true, unique: true })
	userId: string;

	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: String, required: true })
	email: string;

	@Prop({ type: String })
	organization?: string;

	@Prop({ type: String })
	description?: string;

	@Prop({ type: String })
	phone?: string;

	@Prop({ type: String })
	website?: string;

	@Prop({
		type: {
			street: { type: String, required: true },
			city: { type: String, required: true },
			state: { type: String, required: true },
			zipCode: { type: String, required: true },
			country: { type: String, required: true },
		},
	})
	address?: {
		street: string;
		city: string;
		state: string;
		zipCode: string;
		country: string;
	};

	@Prop({ type: Boolean, default: false })
	verified: boolean;

	@Prop({ type: Number, default: 0, min: 0, max: 5 })
	rating: number;

	@Prop({ type: Number, default: 0 })
	totalEvents: number;
}

export const OrganizerSchema = SchemaFactory.createForClass(Organizer);
