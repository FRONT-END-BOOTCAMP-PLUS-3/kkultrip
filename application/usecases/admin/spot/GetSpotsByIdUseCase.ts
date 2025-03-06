import { SpotRepository } from "@/domain/repositories/SpotRepository";
import { TicketRepository } from "@/domain/repositories/TicketRepository";
import { TimeRepository } from "@/domain/repositories/TimeRepository";
import { GetSpotDto } from "./dto/GetSpotDto";

export class GetSpotByIdUseCase {
  constructor(
    private spotRepository: SpotRepository,
    private ticketRepository: TicketRepository,
    private timeRepository: TimeRepository // 추가
  ) {}

  async execute(id: number): Promise<GetSpotDto | null> {
    const spot = await this.spotRepository.getSpotById(id);
    if (!spot) return null;

    const tickets = await this.ticketRepository.getTicketBySpotId(id);
    const times = await this.timeRepository.getTimeBySpotId(id);

    return {
      id: spot.id,
      name: spot.name,
      address: spot.address,
      lon: spot.lon,
      lat: spot.lat,
      phone: spot.phone ?? null,
      info: spot.info ?? null,
      category: spot.category,
      link: spot.link ?? null,
      img: spot.img,
      avgPrice: spot.avgPrice ?? null,
      avgWaitingTime: spot.avgWaitingTime ?? null,
      tickets,
      times, // 추가
      createdAt: spot.createdAt.toISOString(),
      updatedAt: spot.updatedAt.toISOString(),
    };
  }
}
