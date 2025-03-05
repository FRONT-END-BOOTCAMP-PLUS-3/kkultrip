import { prisma } from "@/lib/prisma";
import { TicketRepository } from "@/domain/repositories/TicketRepository";
import { Ticket } from "@prisma/client";

export class PgTicketRepository implements TicketRepository {
  async getTicketBySpotId(spotId: number): Promise<Ticket[]> {
    return await prisma.ticket.findMany({
      where: {
        spotId,
      },
    });
  }
  async createTicket(
    ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">
  ): Promise<Ticket> {
    return await prisma.ticket.create({
      data: {
        ...ticket,
      },
    });
  }
  async updateTicket(
    id: number,
    ticket: Partial<Ticket>
  ): Promise<Ticket | null> {
    return await prisma.ticket.update({
      where: { id },
      data: ticket,
    });
  }

  async deleteTicket(id: number): Promise<Ticket | null> {
    try {
      return await prisma.ticket.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Error deleting ticket:", error);
      return null;
    }
  }
}
