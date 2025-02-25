import { SpotRepository } from "@/domain/repositories/SpotRepository";
import { GetSpotDto } from "./dto/GetSpotDto";

export class GetSpotsUseCase {
  constructor(private spotRepository: SpotRepository) {}

  async execute(): Promise<GetSpotDto[]> {
    const spots = await this.spotRepository.getAllSpots();

    return spots.map((spot) => ({
      ...spot,
      createdAt: spot.createdAt.toISOString(), // Date → string 변환
      updatedAt: spot.updatedAt.toISOString(), // Date → string 변환
    }));
  }
}
