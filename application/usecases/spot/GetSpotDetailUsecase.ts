import { SpotRepository } from "@/domain/repositories/SpotRepository";
import { SpotDetailDto } from "./dto/SpotDetailDto";
import TicketRepository from "@/domain/repositories/TicketRepository";

export class GetSpotDetailUsecase {
    constructor(
        private spotRepository: SpotRepository,
        private ticketRepository: TicketRepository
    ) {}

    async execute(id: number): Promise<SpotDetailDto | null> {
        const spot = await this.spotRepository.getSpotById(id);
        if (!spot) return null;

        const tickets = await this.ticketRepository.getTicketBySpotId(id);
        if (!tickets) return null;

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
        };
    }
}
