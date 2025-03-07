import TipRepository from "@/domain/repositories/TipRepository";
import SpotRepository from "@/domain/repositories/SpotRepository";

export default class DeleteTipUsecase {
    constructor(
        private tipRepository: TipRepository,
        private spotRepository: SpotRepository
    ) {}

    async execute(tipId: number, spotId: number): Promise<void> {
        // 1. 삭제할 팁의 정보 가져오기
        const tip = await this.tipRepository.getTipById(tipId);

        // 2. 현재 Spot의 평균 값 가져오기
        const spotAvg = await this.spotRepository.getSpotAvg(spotId);
        const tipCount = await this.tipRepository.countBySpot(spotId);

        // 3. 새로운 평균 값 계산
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

        // 4. Spot의 평균 가격과 대기시간 업데이트
        await this.spotRepository.updateSpotAvg(
            spotId,
            newAvgPrice,
            newAvgWaitingTime
        );

        // 5. 팁 삭제
        await this.tipRepository.deleteTip(tipId);
    }
}
