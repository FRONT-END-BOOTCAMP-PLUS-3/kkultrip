import { CreateTicketDto } from "./dto/CreateTicketDto";
import { Ticket } from "@prisma/client";
import TicketRepository from "@/domain/repositories/TicketRepository";

export class CreateTicketUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(spotId: number, dto: CreateTicketDto): Promise<Ticket> {
    const newTicket = {
      spotId: spotId,
      name: dto.name,
      price: dto.price,
    };

    return await this.ticketRepository.createTicket(newTicket);
  }
}
