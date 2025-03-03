import { SpotRepository } from "@/domain/repositories/SpotRepository";
import { SpotDetailDto } from "./dto/SpotDetailDto";

export class GetSpotDetailUsecase {
    constructor(private spotRepository: SpotRepository) {}

    async execute(id: number): Promise<SpotDetailDto | null> {
        const spot = await this.spotRepository.getSpotById(id);
        if (!spot) return null;

        return {
            id: spot.id,
            name: spot.name,
            address: spot.address,
            phone: spot.phone,
            info: spot.info,
            category: spot.category,
            link: spot.link || "",
            avgPrice: spot.avgPrice,
            avgWaitingTime: spot.avgWaitingTime,
        };
    }
}
