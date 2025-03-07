import SpotRepository from "@/domain/repositories/SpotRepository";
import { GetSpotListDto } from "./dto/GetSpotListDto";

export class GetSpotListUseCase {
  constructor(private spotRepository: SpotRepository) {}

  async execute(): Promise<GetSpotListDto[]> {
    const spots = await this.spotRepository.getAllSpots();

    return spots.map((spot) => {
      return {
        id: spot.id,
        name: spot.name,
        address: spot.address,
        phone: spot.phone,
        category: spot.category,
        info: spot.info,
      };
    });
  }
}
