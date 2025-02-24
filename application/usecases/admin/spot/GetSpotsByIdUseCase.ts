import { SpotRepository } from "@/domain/repositories/SpotRepository";
import { GetSpotDto } from "./dto/GetSpotDto";

export class GetSpotByIdUseCase {
  constructor(private spotRepository: SpotRepository) {}

  async execute(id: number): Promise<GetSpotDto | null> {
    const spot = await this.spotRepository.getSpotById(id);

    if (!spot) return null;

    return {
      id: spot.id,
      name: spot.name,
      address: spot.address,
      lon: spot.lon,
      lat: spot.lat,
      phone: spot.phone,
      info: spot.info ?? null,
      category: spot.category,
      link: spot.link ?? null,
      img: spot.img,
      avgPrice: spot.avgPrice ?? null,
      avgWaitingTime: spot.avgWaitingTime ?? null,
      createdAt: spot.createdAt.toISOString(), // Date → string 변환
      updatedAt: spot.updatedAt.toISOString(), // Date → string 변환
    };
  }
}
