import { Spot } from "@prisma/client";
import { SpotRepository } from "@/domain/repositories/SpotRepository";
import { UpdateSpotDto } from "./admin/spot/dto/UpdateSpotDto";

export class UpdateSpotUseCase {
  constructor(private spotRepository: SpotRepository) {}

  async execute(id: number, dto: UpdateSpotDto): Promise<Spot | null> {
    const existingSpot = await this.spotRepository.getSpotById(id);
    if (!existingSpot) {
      throw new Error("Spot not found");
    }

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

    return await this.spotRepository.updateSpot(id, updatedSpot);
  }
}
