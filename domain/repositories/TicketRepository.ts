import { Ticket } from "@prisma/client";

export interface TicketRepository {
  getTicketBySpotId(spotId: number): Promise<Ticket[]>;
  createTicket(
    data: Omit<Ticket, "id" | "createdAt" | "updatedAt">
  ): Promise<Ticket>;
  updateTicket(id: number, data: Partial<Ticket>): Promise<Ticket | null>;
  deleteTicket(id: number): Promise<Ticket | null>;
}
