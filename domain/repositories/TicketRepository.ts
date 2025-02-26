import { Ticket } from "@prisma/client";

export default interface TicketRepository {
  createTicket(
    data: Omit<Ticket, "id" | "createdAt" | "updatedAt">
  ): Promise<Ticket>;
}
