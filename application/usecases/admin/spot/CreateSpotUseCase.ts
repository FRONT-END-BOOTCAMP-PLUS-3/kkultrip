import { Spot, Ticket } from "@prisma/client";
import { SpotRepository } from "@/domain/repositories/SpotRepository";
import { TicketRepository } from "@/domain/repositories/TicketRepository";
import { CreateSpotDto } from "./dto/CreateSpotDto";

export class CreateSpotUseCase {
  constructor(
    private spotRepository: SpotRepository,
    private ticketRepository: TicketRepository
  ) {}

  async execute(
    dto: CreateSpotDto
  ): Promise<{ spot: Spot; tickets: Ticket[] }> {
    // Spot 데이터 생성
    const newSpot = {
      name: dto.name,
      address: dto.address,
      lon: dto.lon,
      lat: dto.lat,
      phone: dto.phone,
      info: dto.info ?? "",
      category: dto.category,
      link: dto.link ?? null,
      img: dto.img,
      avgPrice: dto.avgPrice ?? 0,
      avgWaitingTime: dto.avgWaitingTime ?? 0,
    };

    const createdSpot = await this.spotRepository.createSpot(newSpot);

    const tickets: Ticket[] = [];
    if (dto.tickets && dto.tickets.length > 0) {
      for (const ticketDto of dto.tickets) {
        const newTicket = {
          spotId: createdSpot.id,
          name: ticketDto.name,
          price: ticketDto.price,
        };
        const createdTicket = await this.ticketRepository.createTicket(
          newTicket
        );
        tickets.push(createdTicket);
      }
    }

    return { spot: createdSpot, tickets };
  }
}
