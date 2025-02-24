import { SpotRepository } from "@/domain/repositories/SpotRepository";
import { GetSpotDto } from "./dto/GetSpotDto";

export class GetSpotsUseCase {
  constructor(private spotRepository: SpotRepository) {}

  async execute(): Promise<GetSpotDto[]> {
    const spots = await this.spotRepository.getAllSpots();

    return spots.map((spot) => ({
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
    }));
  }
}
