import { Ticket } from "@prisma/client";
import { TicketRepository } from "@/domain/repositories/TicketRepository";

export class DeleteTicketUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(ticketId: number): Promise<Ticket | null> {
    return this.ticketRepository.deleteTicket(ticketId);
  }
}
