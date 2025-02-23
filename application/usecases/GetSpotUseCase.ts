import { Spot } from "@/domain/entities/Spot";
import { SpotRepository } from "@/domain/repositories/SpotRepository";

export class GetSpotUseCase {
  constructor(private spotRepository: SpotRepository) {}

  async execute(): Promise<Spot[]> {
    return await this.spotRepository.getAllSpots();
  }
}
