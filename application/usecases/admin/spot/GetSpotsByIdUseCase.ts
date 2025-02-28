import { SpotRepository } from "@/domain/repositories/SpotRepository";
import { TicketRepository } from "@/domain/repositories/TicketRepository";
import { GetSpotDto } from "./dto/GetSpotDto";
import { Spot } from "@prisma/client";

export class GetSpotByIdUseCase {
  constructor(
    private spotRepository: SpotRepository,
    private ticketRepository: TicketRepository // 추가
  ) {}

  async execute(id: number): Promise<GetSpotDto | null> {
    const spot: Spot | null = await this.spotRepository.getSpotById(id);
    if (!spot) return null;

    const tickets = await this.ticketRepository.getTicketBySpotId(id); // 해당 spotId의 티켓 조회

    return {
      id: spot.id,
      name: spot.name,
      address: spot.address,
      lon: spot.lon,
      lat: spot.lat,
      phone: spot.phone,
      info: spot.info,
      category: spot.category,
      link: spot.link ?? null,
      img: spot.img,
      avgPrice: spot.avgPrice ?? null,
      avgWaitingTime: spot.avgWaitingTime ?? null,
      tickets, // 티켓 정보 추가
      createdAt: spot.createdAt.toISOString(),
      updatedAt: spot.updatedAt.toISOString(),
    };
  }
}
