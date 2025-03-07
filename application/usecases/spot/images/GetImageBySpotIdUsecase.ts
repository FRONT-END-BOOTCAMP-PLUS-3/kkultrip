
import { ImageRepository } from "@/domain/repositories/ImageRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import { Tip, Image } from "@prisma/client";

export default class GetImageBySpotIdUsecase {
    constructor(
        private tipRepository: TipRepository,
        private imageRepository: ImageRepository
    ) {}

    async execute(
        spotId: number,
        orderBy: "createdAt" | "reactionCount"
    ): Promise<Image[]> {
        // 해당 spotId에 맞는 tip들을 가져옵니다.
        const tips: Tip[] = await this.tipRepository.getTipsBySpotId(
            spotId,
            orderBy
        );
        if (!tips || tips.length === 0) return [];

        // 각 tip에 대해 image들을 가져와 배열의 배열 형태로 반환합니다.
        const imagesArrays: Image[][] = await Promise.all(
            tips.map((tip) => this.imageRepository.getImageByTipId(tip.id))
        );

        // 다차원 배열을 평탄화하여 모든 image들을 하나의 배열로 만듭니다.
        const images: Image[] = imagesArrays.flat();
        return images;
    }
}
