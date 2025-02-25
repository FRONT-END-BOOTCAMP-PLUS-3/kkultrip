import { Spot } from "@prisma/client";
import { SpotRepository } from "@/domain/repositories/SpotRepository";
import { CreateSpotDto } from "./dto/CreateSpotDto";

export class CreateSpotUseCase {
  constructor(private spotRepository: SpotRepository) {}

  async execute(dto: CreateSpotDto): Promise<Spot> {
    //DTO에서 받은 데이터 Spot 객체로 변환하면서 누락값에 대한 기본값 설정
    const newSpot = {
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
    };

    return await this.spotRepository.createSpot(newSpot);
  }
}
