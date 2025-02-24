import { Spot } from "@prisma/client";
import { SpotRepository } from "@/domain/repositories/SpotRepository";
import { CreateSpotDto } from "./dto/CreateSpotDto";

export class CreateSpotUseCase {
  constructor(private spotRepository: SpotRepository) {}

  async execute(dto: CreateSpotDto): Promise<Spot> {
    const newSpot: Spot = {
      id: 0, // DB에서 자동 생성
      name: dto.name,
      address: dto.address,
      lon: dto.lon,
      lat: dto.lat,
      phone: dto.phone,
      info: dto.info ?? "",
      category: dto.category,
      link: dto.link ?? null,
      img: dto.img,
      avgPrice: dto.avgPrice ?? 0,
      avgWaitingTime: dto.avgWaitingTime ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.spotRepository.createSpot(newSpot);
  }
}
