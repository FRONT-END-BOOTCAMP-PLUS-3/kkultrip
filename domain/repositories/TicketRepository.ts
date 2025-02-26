import { Ticket } from "@prisma/client";

export default interface TicketRepository {
    getTicketBySpotId(spotId: number): Promise<Ticket[] | null>;
}
