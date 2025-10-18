import { PartialType } from '@nestjs/swagger';
import { CreateOrganizerDTO } from './create-organizer.dto';

export class UpdateOrganizerDTO extends PartialType(CreateOrganizerDTO) {}
