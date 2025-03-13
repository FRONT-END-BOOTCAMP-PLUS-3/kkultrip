import TipRepository from "@/domain/repositories/TipRepository";
import SpotRepository from "@/domain/repositories/SpotRepository";
import { ImageRepository } from "@/domain/repositories/ImageRepository";

export default class DeleteTipUsecase {
    constructor(
        private tipRepository: TipRepository,
        private spotRepository: SpotRepository,
        private imageRepository: ImageRepository // 이미지 레포지토리 추가
    ) {}

    async execute(tipId: number, spotId: number): Promise<void> {
        const tip = await this.tipRepository.getTipById(tipId);

        const imagePaths = await this.imageRepository.getImagesByTipId(tipId);

        if (imagePaths.length > 0) {
            await this.imageRepository.deleteImagesByPaths(imagePaths);
        }

        const spotAvg = await this.spotRepository.getSpotAvg(spotId);
        const tipCount = await this.tipRepository.countBySpot(spotId);

        const newAvgPrice =
            tipCount > 1
                ? ((spotAvg?.avgPrice || 0) * tipCount - (tip?.price || 0)) /
                  (tipCount - 1)
                : 0;
        const newAvgWaitingTime =
            tipCount > 1
                ? ((spotAvg?.avgWaitingTime || 0) * tipCount -
                      (tip?.waitingTime || 0)) /
                  (tipCount - 1)
                : 0;

        await this.spotRepository.updateSpotAvg(
            spotId,
            newAvgPrice,
            newAvgWaitingTime
        );

        await this.tipRepository.deleteTip(tipId);
    }
}
