import  SpotRepository  from "@/domain/repositories/SpotRepository";
import { SpotHeaderDto } from "./dto/SpotHeaderDto";

export class GetSpotHeaderUsecase {
    constructor(private spotRepository: SpotRepository) {}

    async execute(spotId: number): Promise<SpotHeaderDto | null> {
        const spot = await this.spotRepository.getSpotById(spotId);
        if (!spot) return null;

        return {
            id: spot.id,
            name: spot.name,
            category: spot.category,
            img: spot.img,
        };
    }
}
