import { Spot, Ticket } from "@prisma/client";
import SpotRepository from "@/domain/repositories/SpotRepository";
import { TicketRepository } from "@/domain/repositories/TicketRepository";
import { UpdateSpotDto } from "./dto/UpdateSpotDto";

export class UpdateSpotUseCase {
  constructor(
    private spotRepository: SpotRepository,
    private ticketRepository: TicketRepository
  ) {}

  async execute(
    id: number,
    dto: UpdateSpotDto
  ): Promise<{ spot: Spot | null; tickets: Ticket[] }> {
    const existingSpot = await this.spotRepository.getSpotById(id);
    if (!existingSpot) {
      throw new Error("Spot not found");
    }

    // Spot 업데이트
    const updatedSpot: Partial<Spot> = {
      name: dto.name ?? existingSpot.name,
      address: dto.address ?? existingSpot.address,
      lon: dto.lon ?? existingSpot.lon,
      lat: dto.lat ?? existingSpot.lat,
      phone: dto.phone ?? existingSpot.phone,
      info: dto.info ?? existingSpot.info,
      category: dto.category ?? existingSpot.category,
      link: dto.link ?? existingSpot.link,
      img: dto.img ?? existingSpot.img,
      avgPrice: dto.avgPrice ?? existingSpot.avgPrice,
      avgWaitingTime: dto.avgWaitingTime ?? existingSpot.avgWaitingTime,
      updatedAt: new Date(),
    };

    const updatedSpotResult = await this.spotRepository.updateSpot(
      id,
      updatedSpot
    );

    // 티켓 업데이트 로직
    const updatedTickets: Ticket[] = [];
    if (dto.tickets && dto.tickets.length > 0) {
      for (const ticketDto of dto.tickets) {
        if (ticketDto.id) {
          // 기존 티켓 업데이트
          const existingTicket = await this.ticketRepository.updateTicket(
            ticketDto.id,
            {
              name: ticketDto.name,
              price: ticketDto.price,
            }
          );
          if (existingTicket) {
            updatedTickets.push(existingTicket);
          }
        } else {
          // 새로운 티켓 생성 (필요하면 추가 가능)
          const newTicket = await this.ticketRepository.createTicket({
            spotId: id,
            name: ticketDto.name,
            price: ticketDto.price,
          });
          updatedTickets.push(newTicket);
        }
      }
    }

    return { spot: updatedSpotResult, tickets: updatedTickets };
  }
}
