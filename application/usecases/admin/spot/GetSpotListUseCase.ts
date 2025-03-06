import SpotRepository from "@/domain/repositories/SpotRepository";
import { GetSpotListDto } from "./dto/GetSpotListDto";
import { Spot } from "@prisma/client";

export class GetSpotListUseCase {
  constructor(private spotRepository: SpotRepository) {}

  async execute(): Promise<GetSpotListDto[]> {
    const spots = await this.spotRepository.getAllSpots();

    return spots.map((spot: Spot) => ({
      ...spot,
      createdAt: spot.createdAt.toISOString(), // Date → string 변환
      updatedAt: spot.updatedAt.toISOString(), // Date → string 변환
    }));
  }
}
