import { Spot } from "@prisma/client";
import SpotRepository from "@/domain/repositories/SpotRepository";

export class DeleteSpotUseCase {
  constructor(private spotRepository: SpotRepository) {}

  async execute(id: number): Promise<Spot | null> {
    const existingSpot = await this.spotRepository.getSpotById(id);
    if (!existingSpot) {
      throw new Error("Spot not found");
    }

    return await this.spotRepository.deleteSpot(id);
  }
}
