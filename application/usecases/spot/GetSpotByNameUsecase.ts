import BookmarkRepository from "@/domain/repositories/BookmarkRepository";
import { GetSpotsDTO } from "./dto/GetSpotsDto";
import  SpotRepository  from "@/domain/repositories/SpotRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import TimeRepository from "@/domain/repositories/TimeRepository";

export class GetSpotByNameUsecase {
  constructor(
    private spotRepo: SpotRepository,
    private bookmarkRepo: BookmarkRepository,
    private tipRepo: TipRepository,
    private timeRepo: TimeRepository
  ) {}

  async execute(name: string): Promise<GetSpotsDTO[]> {
    const spot = await this.spotRepo.getSpotByName(name);

    // 검색된 명소가 없을 경우 빈 배열 반환 (에러 발생 X)
    if (!spot) {
      return [];
    }

    const bookmarkCnt = await this.bookmarkRepo.countBySpot(spot.id);
    const tipCnt = await this.tipRepo.countBySpot(spot.id);
    const time = await this.timeRepo.getTodayHours(spot.id);

    return [{ ...spot, bookmarkCnt, tipCnt, time }];
  }
}
