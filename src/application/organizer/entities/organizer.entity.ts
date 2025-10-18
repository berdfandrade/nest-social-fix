export class Organizer {
	id: string;
	userId: string; // Referência ao usuário que é organizador
	name: string;
	email: string;
	organization?: string; // Nome da organização (opcional)
	description?: string; // Descrição do organizador
	phone?: string; // Telefone de contato
	website?: string; // Site da organização
	address?: {
		street: string;
		city: string;
		state: string;
		zipCode: string;
		country: string;
	};
	verified: boolean; // Se o organizador foi verificado pela plataforma
	rating: number; // Avaliação média dos voluntários (0-5)
	totalEvents: number; // Total de eventos organizados
	createdAt: Date;
	updatedAt: Date;
}
