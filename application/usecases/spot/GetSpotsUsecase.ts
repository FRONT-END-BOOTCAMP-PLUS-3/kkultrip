import { GetSpotsDTO } from "./dto/GetSpotsDto";
import BookmarkRepository from "@/domain/repositories/BookmarkRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import TimeRepository from "@/domain/repositories/TimeRepository";
import { SpotRepository } from "@/domain/repositories/SpotRepository";

export class GetSpotsUsecase {
  constructor(
    private spotRepo: SpotRepository,
    private bookmarkRepo: BookmarkRepository,
    private tipRepo: TipRepository,
    private timeRepo: TimeRepository
  ) {}

  async execute(
    lat: number,
    lng: number,
    category?: string,
    maxPrice?: number
  ): Promise<GetSpotsDTO[]> {
    // 명소테이블 조회
    const spots = await this.spotRepo.getNearbySpots(
      lat,
      lng,
      category,
      maxPrice
    );

    // 명소가 없으면 빈 배열 반환 (에러 발생 X)
    if (spots.length === 0) {
      return [];
    }

    // 추가 정보 (북마크 수, 꿀팁 수, 영업시간) 조회
    const spotsWithDetails = await Promise.all(
      spots.map(async (spot) => {
        const bookmarkCnt = await this.bookmarkRepo.countBySpot(spot.id);
        const tipCnt = await this.tipRepo.countBySpot(spot.id);
        const time = await this.timeRepo.getTodayHours(spot.id);

        return { ...spot, bookmarkCnt, tipCnt, time };
      })
    );

    return spotsWithDetails;
  }
}
