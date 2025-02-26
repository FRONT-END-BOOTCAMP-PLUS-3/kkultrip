import SpotRepository from "@/domain/repositories/SpotRepository";
import TicketRepository from "@/domain/repositories/TicketRepository";
import TimeRepository from "@/domain/repositories/TimeRepository";
import { Ticket, Time } from "@prisma/client";
import { SpotDetailDto } from "./dto/SpotDetailDto";

export class GetSpotDetailUsecase {
    constructor(
        private spotRepository: SpotRepository,
        private ticketRepository: TicketRepository,
        private timeRepository: TimeRepository
    ) {}

    async execute(id: number): Promise<SpotDetailDto | null> {
        const spot = await this.spotRepository.getSpotById(id);
        if (!spot) return null;

        const tickets: Ticket[] | null =
            await this.ticketRepository.getTicketBySpotId(id);
        if (!tickets) return null;

        const times: Time[] | null = await this.timeRepository.getTimeBySpotId(
            id
        );
        if (!times) return null;

        return {
            id: spot.id,
            name: spot.name,
            address: spot.address,
            phone: spot.phone,
            info: spot.info,
            category: spot.category,
            link: spot.link || "",
            avgPrice: spot.avgPrice,
            avgWaitingTime: spot.avgWaitingTime,
            ticketDetail: tickets.map((ticket) => ({
                id: ticket.id,
                name: ticket.name,
                price: ticket.price,
            })),
            timeDetail: times.map((time) => ({
                open: time.open,
                close: time.close,
                day: time.day,
            })),
        };
    }
}
