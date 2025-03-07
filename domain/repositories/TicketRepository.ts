import { Ticket } from "@prisma/client";

export interface TicketRepository {
  getTicketBySpotId(spotId: number): Promise<Ticket[]>;
  createTicket(data: Ticket): Promise<Ticket>;
  updateTicket(id: number, data: Ticket): Promise<Ticket | null>;
  deleteTicket(id: number): Promise<Ticket | null>;
}
