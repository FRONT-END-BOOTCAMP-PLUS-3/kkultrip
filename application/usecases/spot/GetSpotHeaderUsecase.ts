import BookmarkRepository from "@/domain/repositories/BookmarkRepository";
import SpotRepository from "@/domain/repositories/SpotRepository";
import { SpotHeaderDto } from "./dto/SpotHeaderDto";

export class GetSpotHeaderUsecase {
    constructor(
        private spotRepository: SpotRepository,
        private bookmarkRepository: BookmarkRepository
    ) {}

    async execute(
        spotId: number,
        userId: string
    ): Promise<SpotHeaderDto | null> {
        const spot = await this.spotRepository.getSpotById(spotId);
        if (!spot) return null;

        const isBookMarked = await this.bookmarkRepository.checkBookmark(
            spotId,
            userId
        );

        return {
            id: spot.id,
            name: spot.name,
            category: spot.category,
            img: spot.img,
            isBookMarked: isBookMarked,
        };
    }
}
