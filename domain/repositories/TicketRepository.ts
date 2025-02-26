import { Ticket } from "@prisma/client";

export default interface TicketRepository {
  getTicketBySpotId(spotId: number): Promise<Ticket[]>;
  createTicket(
    data: Omit<Ticket, "id" | "createdAt" | "updatedAt">
  ): Promise<Ticket>;
}
