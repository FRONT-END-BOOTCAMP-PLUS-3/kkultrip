import { Ticket } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import TicketRepository from "@/domain/repositories/TicketRepository";

export default class PgTicketRepository implements TicketRepository {
    async getTicketBySpotId(spotId: number): Promise<Ticket[] | null> {
        return prisma.ticket.findMany({
            where: {
                spotId
            },
        });
    }
}
