import SpotRepository from "@/domain/repositories/SpotRepository";
import { GetBookmarkedSpotDto } from "./dto/GetBookmarkedSpotDto";
import BookmarkRepository from "@/domain/repositories/BookmarkRepository";

export class GetBookmarkedSpotsUsecase {
  constructor(
    private bookmarkRepository: BookmarkRepository,
    private spotRepository: SpotRepository
  ) {}

  async execute(userId: string): Promise<GetBookmarkedSpotDto[]> {
    const bookmarkedSpotIds = await this.bookmarkRepository.getSpotIdsByUserId(
      userId
    );

    if (!bookmarkedSpotIds || bookmarkedSpotIds.length === 0) {
      return [];
    }

    const spots = await Promise.all(
      bookmarkedSpotIds.map((spotId) => this.spotRepository.getSpotById(spotId))
    );

    const bookmarkedSpotList: GetBookmarkedSpotDto[] = await Promise.all(
      spots.map((spot) => {
        if (!spot) {
          throw new Error("Spot 정보를 찾을 수 없습니다.");
        }

        return {
          img: spot.img,
          name: spot.name,
          category: spot.category,
        };
      })
    );

    return bookmarkedSpotList;
  }
}
