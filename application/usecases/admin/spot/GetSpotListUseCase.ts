import SpotRepository from "@/domain/repositories/SpotRepository";
import { SpotListDto } from "./dto/SpotListDto";

export class GetSpotListUseCase {
  constructor(private spotRepository: SpotRepository) {}

  async execute(page: number = 1): Promise<SpotListDto> {
    const limit = 10; // 한 페이지당 10개씩
    const offset = (page - 1) * limit;

    // 전체 스팟 목록을 가져옴
    const spots = await this.spotRepository.getAllSpots();
    const totalCount = spots.length; // 전체 스팟 수

    // 페이지에 맞게 스팟을 자름
    const paginatedSpots = spots.slice(offset, offset + limit);

    const totalPages = Math.ceil(totalCount / limit);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      spots: paginatedSpots.map((spot) => ({
        id: spot.id,
        name: spot.name,
        address: spot.address,
        phone: spot.phone,
        category: spot.category,
        info: spot.info,
      })),
      totalCount,
      totalPages,
      hasPreviousPage,
      hasNextPage,
      pages: Array.from({ length: totalPages }, (_, i) => i + 1),
    };
  }
}
