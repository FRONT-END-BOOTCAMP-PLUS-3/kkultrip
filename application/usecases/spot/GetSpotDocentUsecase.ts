import DocentRepository from "@/domain/repositories/DocentRepository";
import { SpotDocentDto } from "./dto/SpotDocentDto";
import { Docent, Spot } from "@prisma/client";
import SpotRepository from "@/domain/repositories/SpotRepository";

export class GetSpotDocentUsecase {
    constructor(
        private docentRepository: DocentRepository,
        private spotRepository: SpotRepository
    ) {}

    async execute(spotId: number): Promise<SpotDocentDto[] | null> {
        const docents: Docent[] | null =
            await this.docentRepository.getDocentBySpotId(spotId);
        if (!docents) return null;
        const spot: Spot | null = await this.spotRepository.getSpotById(spotId);
        if (!spot) return null;

        return docents.map((docent) => ({
            id: docent.id,
            spotName: spot.name,
            spotId: docent.spotId,
            title: docent.title,
            description: docent.description,
            audioPath: docent.audioPath,
        }));
    }
}
